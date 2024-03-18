import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, } from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import * as Progress from 'react-native-progress';
import { ScrollView } from 'native-base';
import Checkbox from 'expo-checkbox';
import { indexOf, isArrayBuffer, set, stubArray } from 'lodash';
import { useIsFocused } from '@react-navigation/native';
interface Props {
  weekView?: boolean;
}
interface Reminder {
  __v: number,
  _id: string,
  amount: number,
  hour: number,
  minute: number,
  name: string,
  period: number,
  start_date: number,
  start_month: number,
  start_year: number,
  state: boolean,
}
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export function Task({ task, handleCheckBox }: { task: Reminder, handleCheckBox: (task: Reminder) => void }) {
  return (
    <View style={{ height: 80, width: width * 14 / 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
      <View style={styles.task_container}>
        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>{task.name}</Text>
          <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../img/clock.png')} style={{ height: 20, width: 20 }}></Image>
            <Text style={{ fontSize: 12 }}>{task.hour}:{task.minute}</Text>
          </View>

        </View>
        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
          <Text style={{ color: "#8b8c89" }}>{task.amount} pill</Text>
          {
            task.state ?
              <Image source={require('../img/done.png')}></Image>
              :
              <Checkbox
                value={task.state}
                onValueChange={() => handleCheckBox(task)}
              />
          }
        </View>
      </View>
    </View>
  )
}
const ExpandableCalendarScreen = (props: Props) => {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [isAdd, setIsAdd] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [period, setPeriod] = useState('')
  /// manage date te
  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  let curMonth = monthNames[new Date().getMonth()];
  let curYear = new Date().getFullYear();
  let curDate = new Date().getDate();
  const [taskNumber, setTaskNumber] = useState(0)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const isFocus = useIsFocused();
  const userID = "65c25e4d4a7017b0efb30dc9";
  const api_reminder = `https://medifind-be.proudsea-d3f4859a.eastasia.azurecontainerapps.io/api/v1/reminder/${userID}`
  useEffect(() => {
    async function getReminder() {
      try {
        let response = await fetch(api_reminder);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else {
          let data = await response.json();
          const arr = data.data.reminders;
          const sortedList = [...arr].sort((a, b) => {
            if (a.state !== b.state) {
              return a.state ? 1 : -1;
            }
            else if (a.hour !== b.hour) {
              return a.hour - b.hour;
            } else {
              return a.minute - b.minute;
            }
          });
          setReminders(sortedList);
          setTaskNumber(sortedList.length);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getReminder();
  }, []);
  useEffect(() => {
    async function getReminder() {
      try {
        let response = await fetch(api_reminder);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else {
          let data = await response.json();
          const arr = data.data.reminders;
          const sortedList = [...arr].sort((a, b) => {
            if (a.state !== b.state) {
              return a.state ? 1 : -1;
            }
            else if (a.hour !== b.hour) {
              return a.hour - b.hour;
            } else {
              return a.minute - b.minute;
            }
          });
          setReminders(sortedList);
          setTaskNumber(sortedList.length);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getReminder();
  }, [isFocus]);


  async function handleCheckBox(task: Reminder) {
    const API = "https://medifind-be.proudsea-d3f4859a.eastasia.azurecontainerapps.io/api/v1/reminder/";
    const reminderID = task._id;
    try {
      let response = await fetch(`${API}/${reminderID}/${userID}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else {
        const arr = reminders.map((reminder) => {
          if (reminder._id === task._id) {
            return { ...reminder, state: !reminder.state };
          }
          return reminder;
        });
        const sortedList = [...arr].sort((a, b) => {
          if (a.state !== b.state) {
            return a.state ? 1 : -1;
          }
          else if (a.hour !== b.hour) {
            return a.hour - b.hour;
          } else {
            return a.minute - b.minute;
          }
        });
        setReminders(sortedList);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  function handleClose() {
    setIsAdd(false)
    setName('')
    setAmount('')
    setHour('')
    setMinute('')
  }
  async function handleAdd() {
    const API = "https://medifind-be.proudsea-d3f4859a.eastasia.azurecontainerapps.io/api/v1/reminder/";
    const data = {
      name: name,
      amount: parseInt(amount),
      hour: parseInt(hour),
      minute: parseInt(minute),
      period: parseInt(period),
      start_date: new Date().getDate(),
      start_month: new Date().getMonth(),
      start_year: new Date().getFullYear(),
    }
    try {
      const response = await fetch(`${API}/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else {
        const data = await response.json();
        const newReminder = data.data.reminder
        const arr = [...reminders, newReminder];
        const sortedList = [...arr].sort((a, b) => {
          if (a.state !== b.state) {
            return a.state ? 1 : -1;
          }
          else if (a.hour !== b.hour) {
            return a.hour - b.hour;
          } else {
            return a.minute - b.minute;
          }
        });
        setReminders(sortedList);
        setTaskNumber(sortedList.length);
        setIsAdd(false)
        setName('')
        setAmount('')
        setHour('')
        setMinute('')
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Reminder</Text>
      <View style={styles.time}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{curMonth}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{curDate},</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{curYear} </Text>
      </View>
      <View style={{ width: width, justifyContent: 'center', paddingLeft: 20 }}>
        <Text>
          You have total {taskNumber} tasks today
        </Text>
      </View>
      <View style={styles.picker}>
        <Swiper
          index={1}
          //  ref={swiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) {
              return;
            }
            setTimeout(() => {
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setValue(moment(value).add(newIndex, 'week').toDate());
              //swiper.current.scrollTo(1, false);
            }, 100);
          }}>
          {weeks.map((dates, index) => (
            <View
              style={[styles.itemRow, { paddingHorizontal: 16 }]}
              key={index}>
              {dates.map((item, dateIndex) => {
                const isActive =
                  value.toDateString() === item.date.toDateString();
                return (
                  <TouchableWithoutFeedback
                    key={dateIndex}
                    onPress={() => setValue(item.date)}>
                    <View
                      style={[
                        styles.item,
                        isActive && {
                          backgroundColor: '#407BFF',
                          borderColor: '#407BFF',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.itemWeekday,
                          isActive && { color: '#fff' },
                        ]}>
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.itemDate,
                          isActive && { color: '#fff' },
                        ]}>
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ))}
        </Swiper>
      </View>
      <ScrollView>
        {
          reminders.map((reminder, index) => {
            return <Task task={reminder} key={index} handleCheckBox={handleCheckBox} />
          })
        }
      </ScrollView>
      <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 0 }} onPress={() => setIsAdd(true)}>
        <Image source={require('../img/add.png')} />
      </TouchableOpacity>
      {
        isAdd &&
        (
          <View style={styles.add_container}>
            <View style={styles.add_task}>
              <View style={styles.header_add}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Create New Task</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Image source={require('../img/close.png')} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
              </View>
              <View style={styles.input_form}>
                <View style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
                  <TextInput style={styles.input_name} placeholder='Name of medicine' value={name} onChangeText={(text) => setName(text)} />
                  <TextInput style={styles.input_amount} keyboardType="number-pad" placeholder='amount' value={amount} onChangeText={(text) => setAmount(text)} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
                  <TextInput style={styles.input_time} keyboardType="number-pad" placeholder='Hour' value={hour} onChangeText={(text) => setHour(text)} />
                  <TextInput style={styles.input_time} keyboardType="number-pad" placeholder='Minute' value={minute} onChangeText={(text) => setMinute(text)} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>
                  <Text>How many days for task</Text>
                  <TextInput keyboardType='number-pad' placeholder='period ?' style={styles.input_period} value={period} onChangeText={(text) => setPeriod(text)}></TextInput>
                </View>
              </View>
              <TouchableOpacity style={styles.btn_add} onPress={handleAdd}>
                <Text style={{ color: 'white' }}>Add task</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    </View>
  )
}
export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height / 15,
    alignItems: 'center',
    rowGap: 10,
    backgroundColor: "#FFFFFF",
    width: width,
  },
  picker: {
    maxHeight: 90,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  item: {
    flex: 1,
    height: 60,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  time: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 20,
    columnGap: 10,
  },
  task_container: {
    flexDirection: 'column',
    width: 14 * width / 15 - 10,
    padding: 10,
    backgroundColor: '#fff', // Add this line
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 80,
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 16
  },
  add_container: {
    height: height,
    width: width,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: height / 4
  },
  add_task: {
    width: width,
    backgroundColor: 'white',
    alignItems: 'center',
    rowGap: 10
  },
  header_add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height / 12,
    width: width,
    padding: 20
  },
  input_form: {
    width: width,
    rowGap: 20,
    justifyContent: 'center',
  },
  input_name: {
    height: 50,
    width: width * 2 / 3 - 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16
  },
  input_amount: {
    height: 50,
    width: width / 3 - 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16
  },
  input_time: {
    height: 50,
    width: width / 2 - 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16
  },
  input_period: {
    height: 50,
    width: width / 4,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16
  },
  btn_add: {
    width: width * 14 / 15,
    height: 60,
    backgroundColor: '#407BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  }
})

