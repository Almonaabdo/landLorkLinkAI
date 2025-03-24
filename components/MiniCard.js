import React from 'react';
import { View, Text, Image, StyleSheet,Dimensions} from 'react-native';

const MiniCard = ({ title, detail, icon }) => {
  return (
    <View style={{ width: Dimensions.get('window').width - 250, height: Dimensions.get('window').width - 300, backgroundColor: "#ffffff", borderRadius: 10,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 4,elevation: 2, }}>
      <Text style={{ alignSelf: "center", marginTop: "5%", fontWeight: "700" }}>{title}</Text>
      <View style={{ height: 2, backgroundColor: "#E0E0E0", marginVertical: "10%" }}></View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal:"17%" }}>
        <Text style={{ alignSelf: "center", fontSize: 24, fontWeight: "500" }}>{detail}</Text>
        <Image source={icon} style={{ width: 35, height: 35, borderRadius: 4, alignSelf: "center" }} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 0,
    borderRadius: 12,
  }
});

export default MiniCard;



