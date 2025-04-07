/*
* FILE        : RequestsScreen.js
* 
* Description : The Maintenance Screen. Fetches current requests from the database and displays them in a scroll view
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/


import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import RequestCard from '../components/RequestCard';
import { fetchDocuments } from '../Functions';
import { useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';


// Sort according to priority from highest to lowest
const sortRequestsByPriority = (requests) => {
  return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export function Maintenances({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      // fetch data from databse.
      setLoading(true);
      const fetchedRequests = await fetchDocuments("repairRequests");
      const sortedRequests = sortRequestsByPriority(fetchedRequests); // Sort by priority
      setRequests(sortedRequests);
    } 
    catch (err) {
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // Fetch requests when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  if (loading){
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text>Error fetching requests: {error}</Text>;
  }


  return (
    <ScrollView style={{ flex: 1, padding: 12, }}>

      {/*Loop thru all requests and displays them in cards */}
      {requests.map((request, index) => 
      (
        <RequestCard
          key={index}
          title={request.title}
          type={request.type}
          details={request.description}
          status={request.status}
          createdAt={request.createdAt}
          priority={request.priority}
          navigation = {navigation}
        />
      ))}
      
    </ScrollView>
  );
}
