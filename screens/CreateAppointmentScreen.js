import React, { useState, useContext, useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { LOCAL_IP } from "../config/env";
import { AuthContext } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData, postData } from "../api";

const getSalons = async () => {
  return getData(LOCAL_IP + "/salons");
};

const getHairdressersBySalonId = async (salonId) => {
  return getData(LOCAL_IP + "/getHairdressersBySalonId/" + salonId);
};

const getServicesBySalonId = async (salonId) => {
  return getData(LOCAL_IP + "/getSalonServicesById/" + salonId);
};

const CreateAppointmentScreen = ({ navigation }) => {
  const context = useContext(AuthContext);
  const customerId = context.authState.user.id;

  const postAppointment = async () => {
    try {
      const data = await postData(LOCAL_IP + "/appointments", {
        customerId,
        salonId: salon.id,
        hairdresserId: hairdresser.id,
        date,
      });
      await postRequestedServices(data.appointment);
      setSalon({});
      setRequestedServices([]);
      setHairdresser({});
      navigation.push("Your Appointments");
    } catch (error) {
      console.log(error);
    }
  };

  const postRequestedServices = async ({ id: appointmentId }) => {
    requestedServices.forEach(async (requestedService) => {
      await postData(LOCAL_IP + "/createRequestedService", {
        appointmentId,
        serviceId: requestedService.id,
      });
    });
  };

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    setDate(currentDate);
  };

  const [salon, setSalon] = useState({});
  const [hairdresser, setHairdresser] = useState({});
  const [requestedServices, setRequestedServices] = useState([]);

  const [salons, setSalons] = useState([]);
  const [hairdressers, setHairdressers] = useState([]);
  const [salonServices, setSalonServices] = useState([]);

  useEffect(() => {
    const fillSalons = async () => {
      const data = await getSalons();
      setSalons(
        data.salons.map((salonItem) => {
          return { id: salonItem.id, item: salonItem.name };
        })
      );
    };
    fillSalons();
  }, []);

  useEffect(() => {
    const fillHairdressers = async () => {
      try {
        const data = await getHairdressersBySalonId(salon.id);
        setHairdressers(
          data.hairdressers.map((hairdresserItem) => {
            return {
              id: hairdresserItem.id,
              item: hairdresserItem.firstName + " " + hairdresserItem.lastName,
            };
          })
        );
      } catch (error) {}
    };
    fillHairdressers();
  }, [salon]);

  useEffect(() => {
    const fillSalonServices = async () => {
      try {
        const data = await getServicesBySalonId(salon.id);
        setSalonServices(
          data.salonServices.map((salonServiceItem) => {
            return {
              id: salonServiceItem.id,
              item:
                salonServiceItem.serviceName +
                " - " +
                salonServiceItem.duration +
                "dk - " +
                salonServiceItem.price +
                "₺",
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
    fillSalonServices();
  }, [salon]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        marginHorizontal: "5%",
      }}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={{ fontSize: 30, paddingBottom: 20, fontWeight: "600" }}>
          Create Your Appointment
        </Text>
      </View>
      <Text style={{ fontSize: 20, paddingBottom: 10 }}>Salon</Text>
      <SelectBox
        label="Select single"
        options={salons}
        value={salon}
        onChange={onSalonChange()}
        hideInputFilter={false}
      />
      <Text style={{ fontSize: 20, paddingVertical: 10 }}>Hairdresser</Text>
      <SelectBox
        label="Select single"
        options={hairdressers}
        value={hairdresser}
        onChange={onHairdresserChange()}
        hideInputFilter={false}
      />
      <Text style={{ fontSize: 20, paddingVertical: 10 }}>Services</Text>
      <SelectBox
        label="Select multiple"
        options={salonServices}
        selectedValues={requestedServices}
        onMultiSelect={onMultiChange()}
        onTapClose={onMultiChange()}
        isMulti
      />
      <View style={{ width: "100%", display: "flex", marginTop: 10 }}>
        <Text style={{ fontSize: 20, width: "50%" }}>Select the time: </Text>
        <DateTimePicker
          testID="dateTimePicker"
          minimumDate={new Date()}
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          timeZoneOffsetInMinutes={0}
          onChange={onChange}
          style={{ marginTop: -25 }}
        />
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          timeZoneOffsetInMinutes={0}
          onChange={onChange}
        />
      </View>

      <Button
        title="Send Appointment"
        onPress={() => {
          postAppointment();
        }}
      />
    </View>
  );

  function onMultiChange() {
    return (item) =>
      setRequestedServices(xorBy(requestedServices, [item], "id"));
  }

  function onSalonChange() {
    return (val) => setSalon(val);
  }

  function onHairdresserChange() {
    return (val) => setHairdresser(val);
  }
};

export default CreateAppointmentScreen;

const styles = StyleSheet.create({});
