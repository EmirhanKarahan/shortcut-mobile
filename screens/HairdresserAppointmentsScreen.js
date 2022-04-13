import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppointmentCard from "../components/AppointmentCard";
import { LOCAL_IP } from "../config/env";
import { AuthContext } from "../context/AuthContext";
import { getData } from "../api";
import { ScrollView } from "react-native";

const HairdresserAppointmentsScreen = ({ navigation }) => {
  const [error, setError] = useState();
  const [appointments, setAppointments] = useState([]);

  const context = useContext(AuthContext);
  const userId = context.authState.user.id;
  const [salonId, setSalonId] = useState();

  const getAppointments = async () => {
    try {
      const data = await getData(
        LOCAL_IP + "/getAppointmentsBySalonId/" + salonId
      );
      setAppointments(data.appointments);
    } catch (e) {
      setError("Use Effect Failed");
    }
  };

  useEffect(() => {
    const getSalonIdIfHairdresser = async () => {
      try {
        const data = await getData(
          LOCAL_IP + "/salons/checkIfUserHasSalon/" + userId
        );
        setSalonId(data.salonId);
        await getAppointments();
      } catch (e) {
        setError("Use Effect Failed");
      }
    };

    getSalonIdIfHairdresser();
  }, [salonId]);

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30, fontWeight: "600" }}>
          Hairdresser Appointments
        </Text>
        {Array.isArray(appointments) && appointments.length ? (
          appointments.map((appointment) => {
            return (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                getAppointments={getAppointments}
              ></AppointmentCard>
            );
          })
        ) : (
          <Text style={{ fontSize: 20, fontWeight: "600", color: "orangered" }}>
            There is no appointments
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default HairdresserAppointmentsScreen;

const styles = StyleSheet.create({});
