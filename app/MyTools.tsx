import { Image , SafeAreaView, StyleSheet, ScrollView ,View, Text,TextInput, TouchableOpacity} from 'react-native';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState, useRef } from 'react';

export default function MyTools() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
        <SQLiteProvider databaseName="tom.db" onInit={migrateDbIfNeeded}>
          <Text>Home</Text>
            <Content />
          </SQLiteProvider>
    </ScrollView>
  );
}

interface Todo {
  value: string;
  intValue: number;
}

export function Content() {

  const titleInputRef = useRef<TextInput>(null);
  const bodyInputRef = useRef<TextInput>(null);

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
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.form}>
            <TextInput
              ref={titleInputRef}
              style={styles.inputWrap}
              value={newToolTitle}
              onChangeText={setNewToolTitle}
              placeholder="Title"
            />
            <TextInput
              ref={bodyInputRef}
              style={[styles.inputWrap, styles.textArea]}
              value={newToolBody}
              onChangeText={setNewToolBody}
              placeholder="Body"
              multiline
            />
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                titleInputRef.current?.blur();
                bodyInputRef.current?.blur();

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
      
  );
}




async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE mytools (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL);
  `);
    await db.runAsync('INSERT INTO mytools (title, body) VALUES (?, ?)', 'title1', 'body1');
    await db.runAsync('INSERT INTO mytools (title, body) VALUES (?, ?)', 'title2', 'body2');
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
  },
  heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  form: {
      marginBottom: 20,
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
  scrollView:{
    padding:0,
  },
});