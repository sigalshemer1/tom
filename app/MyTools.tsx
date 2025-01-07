import { Image , SafeAreaView, StyleSheet, ScrollView ,View, Text,TextInput, TouchableOpacity} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, useRef } from 'react';

export default function MyTools() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Content />
    </ScrollView>
  );
}

export function Content() {

  interface Tool {
    id: number;
    title: string;
    body: string;
  }
  const [newToolTitle, setNewToolTitle] = useState('');
  const [newToolBody, setNewToolBody] = useState('');
  const [editingTool, setEditingTool] = useState(null);
  const [mytools, setMytools] = useState<Tool[]>([]);

  const db = useSQLiteContext();
 
  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync('SELECT * FROM mytools');
      setMytools(result);
    }
    setup();
  }, [db, mytools]); 

  async function createNewTool () {
    if (!newToolTitle || !newToolBody) {
      alert('Tool title and body must not be empty.');
      return;
    }
    const result = await db.runAsync('INSERT INTO mytools (title, body) VALUES (?, ?)', newToolTitle, newToolBody);
    const newTool: Tool = { id: result.id, title: newToolTitle, body: newToolBody };
    setNewToolTitle('');
    setNewToolBody('');
    setMytools((prev) => [...prev, newTool]);
  };

  async function  saveEditedTool () {
    if (!editingTool || !newToolTitle || !newToolBody) {
      alert('Tool title and body must not be empty.');
      return;
    }
    await db.runAsync('UPDATE mytools SET title = ?, body = ? WHERE id = ?', [newToolTitle,newToolBody,editingTool.id]);
    setEditingTool(null);
    setNewToolTitle('');
    setNewToolBody('');
    setMytools((prev) =>
      prev.map((tool) =>
        tool.id === editingTool.id
          ? { ...tool, title: newToolTitle, body: newToolBody }
          : tool
      )
    );
  };

  async function deleteTool (toolId: number){
    db.runAsync(`DELETE FROM mytools WHERE id=`+ toolId);
    setMytools((prev) => prev.filter((tool) => tool.id !== toolId));
  };

  const startEditing = (tool: any) => {
    setEditingTool(tool);
    setNewToolTitle(tool.title);
    setNewToolBody(tool.body);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.title}>My tools</Text>
        <View style={styles.bodyContainer}>
          <View style={styles.form}>
            <TextInput
              style={styles.inputWrap}
              value={newToolTitle}
              onChangeText={setNewToolTitle}
              placeholder="Title"
            />
            <TextInput
              style={[styles.inputWrap, styles.textArea]}
              value={newToolBody}
              onChangeText={setNewToolBody}
              placeholder="Body"
              multiline
            />
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                if (editingTool) {
                  saveEditedTool();
                } else {
                  createNewTool();
                }
              }}
            >
              <Text style={styles.buttonText}>{editingTool ? 'Save Changes' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
            <View>
              {mytools.map((tool, index) => (
                <View key={index}>
                  <View style={styles.toolItem}>
                    <View style={styles.toolActions}>
                      <TouchableOpacity onPress={() => deleteTool(tool.id)}>
                        <Image source={require('../assets/images/trash.png')} style={styles.actionIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => startEditing(tool)}>
                        <Image source={require('../assets/images/edit.png')} style={styles.actionIcon} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.toolText}>
                      <Text style={{ fontWeight: 'bold' }}>{tool.title}</Text> - {tool.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
        </View>
      </SafeAreaView>
      </ScrollView>  
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal:20,
  },
  heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
  },
  form: {
      marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
    textAlign: 'center',
  },
  inputWrap:{
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor:'#FFFBFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop:6,
    paddingHorizontal:10,
  },
  input: {
      height: 40,
      borderColor: 'transparent',
      marginBottom: 7,
      paddingLeft: 8,
  },
  textArea: {
      height: 80,
      textAlignVertical: 'top',
      marginBottom:6,
  },
  toolItem: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 7,
      borderColor: 'gray',
      borderWidth: 1,
      flexDirection: 'row', // Arrange icons and text side by side
      alignItems: 'center',
  },
  toolActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      marginRight: 10, 
  },
  toolText: {
      fontSize: 16,
      color: '#6F5D6A',
      flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    width:'100%',
  },
  customButton: {
    backgroundColor: '#bf4da2',
    paddingVertical: 12,
    marginBottom:10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 3,
  },
  scrollView: {
    padding: 5,
    flexGrow: 1,
    backgroundColor: '#F3EFF0',
  },
});