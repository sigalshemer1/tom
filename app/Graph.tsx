import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, SafeAreaView, Modal, Image } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const Graph = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Content />
    </SafeAreaView>
  );
};

export function Content() {
  interface Thought {
    id: number;
    level: number;
    created: string; // Used for x-axis labels.
  }

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false); 
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);

  const db = useSQLiteContext();

  const handleTimeChange = (event, time) => {
    setTimePickerVisibility(false);
    if (time) setSelectedDate(time);
  };

  const fetchThoughts = async (startDate, endDate) => {
    try {
      const result = await getThoughtsByDate(startDate.toISOString(), endDate.toISOString());
      
      const formattedData = result.map((item) => {
        const date = new Date(item.created);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Convert to local time
        const formattedDate = localDate.toISOString().split('T')[0] + ' ' + localDate.toISOString().split('T')[1].slice(0, 8); // Format to 'yyyy-MM-dd HH:mm:ss'
        
        return {
          ...item,
          created: formattedDate, // Use the formatted date
        };
      });
      setThoughts(formattedData);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
      setThoughts([]);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      fetchThoughts(startDate, endDate);
    }
  }, [selectedDate]); 

  
  useFocusEffect(
    React.useCallback(() => {
      if (selectedDate) {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        fetchThoughts(startDate, endDate);
      }
    }, [selectedDate])  // This effect depends on `selectedDate`
  );

  
  useEffect(() => {
    fetchAllThoughts(); 
  }, []);

 
  const formatDateToFetch = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getThoughtsByDate = async (startDate, endDate) => {
    try {
      // Format the dates to 'YYYY-MM-DD HH:mm:ss'
      const formattedStartDate = formatDateToFetch(new Date(startDate));
      const formattedEndDate = formatDateToFetch(new Date(endDate));
  
      const result = await db.getAllAsync(
        'SELECT * FROM thoughts WHERE created BETWEEN ? AND ?;',
        [formattedStartDate, formattedEndDate]
      );
      return result;
    } catch (error) {
      console.error('Error in getThoughtsByDate:', error);
      throw error;
    }
  };
  
  

  const fetchAllThoughts = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM thoughts;'); // Fetch all thoughts
      updateHighlightedDates(result); // Update highlighted dates for all available data
    } catch (error) {
      console.error('Error fetching all thoughts:', error);
    }
  };
  

  const CustomDatePicker = ({ isVisible, onClose, onDateSelect, markedDates }) => {
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={onClose} // Handle close when back button is pressed (Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              markedDates={markedDates}
              onDayPress={(day) => {
                onDateSelect(new Date(day.dateString)); // Trigger date selection logic
                onClose(); // Close the calendar modal
                setTooltip(null); 
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };
  

  // Function to update highlighted dates
  const updateHighlightedDates = (data) => {
    const highlighted = data.reduce((acc, item) => {
      // Check if the date contains 'T', indicating it might be in ISO format
      const date = item.created.includes('T') ? item.created.split('T')[0] : item.created.split(' ')[0]; // Get the date part (YYYY-MM-DD)
  
      if (!acc[date]) { 
        acc[date] = { selected: true, marked: true, selectedColor: '#715868' };
      }
      return acc;
    }, {});
  
    setHighlightedDates((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(highlighted)) {
        return highlighted; // Update only if there's a difference
      }
      return prev; // No update needed
    });
  };
  
  

  const graphWidth = screenWidth - 40;
  const graphHeight = 250;
  const padding = 40;

  const points = thoughts.map((thought, index) => {
    const x = (index / (thoughts.length - 1)) * (graphWidth - padding * 2) + padding;
    const y = graphHeight - ((thought.level - 1) / (5 - 1)) * (graphHeight - padding);
    return { x, y, label: thought.created, level: thought.level };
  });

  const handleTouch = (event) => {
    const { locationX } = event.nativeEvent;
    if (points.length === 0) return;
  
    const closestPoint = points.reduce((prev, curr) =>
      Math.abs(curr.x - locationX) < Math.abs(prev.x - locationX) ? curr : prev
    );

    const timePart = closestPoint.label.split(' ')[1];  // This will give you 'HH:mm:ss'
    const formattedTime = timePart.split(':').slice(0, 2).join(':');
  
    setTooltip({
      x: closestPoint.x,
      y: closestPoint.y,
      value: formattedTime,  // Show only the hh:mm part
    });
  };
  

  const yAxisOffset = 4;
  const graphPath = points
    .map((point, index) => {
      const adjustedY = graphHeight - ((point.level - 1) / (5 - 1)) * (graphHeight - padding) - yAxisOffset;
      return index === 0 ? `M${point.x},${adjustedY}` : `L${point.x},${adjustedY}`;
    })
    .join(' ');

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB'); // This formats the date as dd/MM/yyyy
    };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your graph</Text>
        <View>
          <Text  style={styles.description}>The daily graph shows the intensity of your thoughts, by hour at a selected date.</Text>
        </View>

        <View style={styles.buttonContainer}>
        {/* Date Picker */}
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.customButton}>
            <Text style={styles.buttonText}>Pick a Date</Text>
            <Image
              source={require('../assets/images/calendar.png')}  // Update the path if needed
              style={styles.icon}
            />
          </TouchableOpacity>
          
        </View>
        {isDatePickerVisible && (
          <CustomDatePicker
            isVisible={isDatePickerVisible}
            onClose={() => setDatePickerVisibility(false)}
            onDateSelect={(date) => setSelectedDate(date)}
            markedDates={highlightedDates}
          />
        )}
        
        {isTimePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Graph Container */}
        <View style={styles.chartContainer}>
          {thoughts.length === 0 ? (
            <Text style={styles.noDataText}>No records to show</Text>
          ) : (
            <View style={styles.chartWrapper}>
              <Svg width={graphWidth} height={graphHeight} onTouchStart={handleTouch}>
                <Line x1={padding} y1={0} x2={padding} y2={graphHeight} stroke="#aaa" />
                <Line x1={padding} y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="#aaa" />

                
                {[1, 2, 3, 4, 5].map((level) => {
                  const y = graphHeight - ((level - 1) / (5 - 1)) * (graphHeight - padding) - yAxisOffset;
                  return (
                    <SvgText key={level} x={padding - 10} y={y} fontSize="12" textAnchor="end" fill="#aaa">
                      {level}
                    </SvgText>
                  );
                })}

                {/* Line Path */}
                <Path d={graphPath} fill="none" stroke="#715868" strokeWidth={2} />

                {/* Points */}
                {points.map((point, index) => {
                  const y = graphHeight - ((point.level - 1) / (5 - 1)) * (graphHeight - padding) - yAxisOffset;
                  return (
                    <G key={index}>
                      <Circle cx={point.x} cy={y} r={4} fill="#715868" />
                      <SvgText x={point.x} y={graphHeight + 15} fontSize="10" textAnchor="middle">
                        {point.label}
                      </SvgText>
                    </G>
                  );
                })}

                {tooltip && (
                  <>
                    <Line
                      x1={tooltip.x}
                      y1={0}
                      x2={tooltip.x}
                      y2={graphHeight}
                      stroke="gray"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <Circle cx={tooltip.x} cy={tooltip.y-4} r={6} fill="red" />
                  </>
                )}
              </Svg>

              {/* Tooltip */}
              {tooltip && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: tooltip.x - 50,
                      top: tooltip.y - 40,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>{tooltip.value}</Text>
                </View>
              )}
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
            </View>
          )}
          
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3EFF0',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3EFF0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
    textAlign: 'center',
  },
  description: {
    marginBottom: 20,
    color: '#6F5D6A',
  },
  buttonContainer: {
    flexDirection: 'row',  // This makes the buttons appear side by side
    justifyContent: 'space-between',  // Space between the buttons
    width: '100%',  // Ensure the container takes up full width
    marginBottom: 20,  // Add some space below the buttons
  },
  customButton: {
    backgroundColor: '#bf4da2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',  // Ensures text and icon are side by side
    paddingRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  chartWrapper: {
    height: 300,
  width: '100%',
  position: 'relative',
  paddingBottom: 20, 
  borderRadius: 16, 
  backgroundColor: '#f0f0f0', 
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#999999',
  },
  tooltip: {
    position: 'absolute',
  backgroundColor: '#444',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 8,
  zIndex: 9999, // Ensure it appears above the graph
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000', // Add shadow for better visibility
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  },
  
  tooltipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden', 
    backgroundColor: '#fff',
    elevation: 10, 
  },
  selectedDateText: {
    color: '#bf4da2',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',  // This centers the text horizontally
    width: '100%', 
  },
  icon: {
    width: 20,  // Set the size of the icon
    height: 20,
    marginLeft: 8,  // Space between the text and icon
  },
});

export default Graph;
