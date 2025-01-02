import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker'; 
import { BarChart } from 'react-native-chart-kit'; 

const screenWidth = Dimensions.get('window').width; 

const Graph = () => {
  // const [thoughts, setThoughts] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // useEffect(() => {
  //   const fetchThoughts = async () => {
  //     if (selectedDate) {
  //       const startDate = new Date(selectedDate);
  //       const endDate = new Date(selectedDate);

  //       startDate.setHours(0, 0, 0, 0);
  //       endDate.setHours(23, 59, 59, 999);

  //       try {
  //         const fetchedThoughts = await getThoughtsByDate(
  //           startDate.toISOString(),
  //           endDate.toISOString()
  //         );
  //         setThoughts(fetchedThoughts); // Update state with fetched data
  //       } catch (error) {
  //         console.error('Error fetching thoughts:', error);
  //         setThoughts([]); // Clear data on error
  //       }
  //     }
  //   };

  //   fetchThoughts();
  // }, [selectedDate]);

  // // Prepare chart data
  // const chartData = {
  //   labels: thoughts.map((item) => item.date.split('-').slice(1).join('/')),
  //   datasets: [
  //     {
  //       data: thoughts.map((item) => item.level),
  //       colors: (opacity = 1) =>
  //         thoughts.map((item) => (item.level > 3 ? `rgba(219, 3, 99, ${opacity})` : `rgba(144, 200, 94, ${opacity})`)),
  //     },
  //   ],
  // };

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Your Thinking Graph</Text>
  //     <View style={styles.description}>
  //       <Text>The daily graph shows the intensity of your thoughts, by date.</Text>
  //     </View>
  //     {/* Date Picker */}
  //     <DatePicker
  //       date={selectedDate}
  //       onDateChange={(date) => setSelectedDate(date)}
  //       mode="date"
  //       style={styles.datePicker}
  //     />
  //     <View style={styles.chartContainer}>
  //       {thoughts.length === 0 ? (
  //         <Text style={styles.noDataText}>No records to show</Text>
  //       ) : (
  //         <BarChart
  //           data={chartData}
  //           width={screenWidth - 40} // Responsive width
  //           height={220}
  //           fromZero
  //           chartConfig={{
  //             backgroundColor: '#f9f9f9',
  //             backgroundGradientFrom: '#ffffff',
  //             backgroundGradientTo: '#f9f9f9',
  //             decimalPlaces: 0,
  //             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  //             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  //           }}
  //           style={styles.chart}
  //         />
  //       )}
  //     </View>
  //     <View style={styles.listContainer}>
  //       <Text style={styles.subtitle}>Thoughts Table (Debug)</Text>
  //       <FlatList
  //         data={thoughts}
  //         keyExtractor={(item, index) => index.toString()}
  //         renderItem={({ item }) => (
  //           <View style={styles.listItem}>
  //             <Text>Date: {item.date}</Text>
  //             <Text>Level: {item.level}</Text>
  //           </View>
  //         )}
  //       />
  //     </View>
  //   </View>
  // );
  return (<View>Graph</View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#999999',
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  datePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default Graph;
