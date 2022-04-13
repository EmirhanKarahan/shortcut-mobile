import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { getData, deleteData } from "../api";
import { LOCAL_IP } from "../config/env";

const AppointmentCard = ({ appointment, getAppointments }) => {
  const [requestedServices, setRequestedServices] = useState([]);
  const [user, setUser] = useState({});

  const getRequestedServices = async () => {
    try {
      const data = await getData(
        LOCAL_IP + "/getServicesByAppointmentId/" + appointment.id
      );
      setRequestedServices(data.services);
    } catch (e) {
      setError("Use Effect Failed");
    }
  };

  const getUser = async () => {
    try {
      const data = await getData(LOCAL_IP + "/users/" + appointment.customerId);
      setUser(data.user);
    } catch (e) {
      setError("Use Effect Failed");
    }
  };

  useEffect(() => {
    getRequestedServices();
    getUser();
  }, []);

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.hairdresserInfo}>
        <Text style={{ fontSize: 20 }}>{appointment.salonName}</Text>
        <Text style={{ fontSize: 20 }}>
          {appointment.hairdresserFirstName} {appointment.hairdresserLastName}
        </Text>
      </View>
      <View style={styles.date}>
        <Text style={{ fontSize: 16, color: "gray" }}>
          {new Date(appointment.date).toLocaleString([], {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View>
        <Text>
          {user.firstName + " " + user.lastName + " " + user.phoneNumber}
        </Text>
      </View>
      <View style={styles.services}>
        <Text style={{ fontSize: 20 }}>Servisler</Text>
        {requestedServices.map((service) => {
          return <Text key={service.id}>{service.serviceName}</Text>;
        })}
      </View>
      <View style={{ width: "50%", marginHorizontal: "25%" }}>
        <Button
          title="CANCEL"
          onPress={() => {
            Alert.alert("Cancelling An Appointment", "Are you sure?", [
              {
                text: "Go back",
                style: "cancel",
              },
              {
                text: "Yes, cancel it",
                onPress: async () => {
                  await deleteData(
                    LOCAL_IP + "/appointments/" + appointment.id
                  );
                  getAppointments();
                },
              },
            ]);
          }}
        ></Button>
      </View>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  appointmentCard: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  hairdresserInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  date: {},
  services: { paddingVertical: 5 },
});
