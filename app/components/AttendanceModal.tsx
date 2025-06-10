import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS } from '../constants/common';

interface AttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  onOk: (attendanceNote?: string, currentTime?: string) => void;
  loading: boolean;
  data: {
    FullName: string;
    ParentEmail: string;
  };
  type: 'IN' | 'OUT';
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  visible,
  onClose,
  onOk,
  loading,
  data,
  type,
}) => {
  const [attendanceNote, setAttendanceNote] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (type === 'IN' && visible) {
      setAttendanceNote('');
      setCurrentTime(new Date().toISOString());
    }
  }, [type, visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Image
              source={type === "IN" ? require('../images/in.png') : require('../images/out.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.labelValue}>Full Name:</Text>
            <Text style={styles.value}>{data.FullName}</Text>
            <Text style={styles.labelValue}>Parent Email:</Text>
            <Text style={styles.value}>{data.ParentEmail}</Text>
            {type === 'IN' && (
              <>
                <Text style={styles.labelValue}>Attendance Note<Text style={{color:'red'}}> *</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter note"
                  value={attendanceNote}
                  onChangeText={setAttendanceNote}
                  editable={!loading}
                />
              </>
            )}

            <Text style={styles.label}>Current Time:</Text>
            <Text style={styles.value}>{moment().format('DD MMM YYYY, hh:mm A')}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => onOk(attendanceNote, currentTime)}
                disabled={loading || (type === 'IN' && !attendanceNote)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.okText}>OK</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, marginBottom: 16, textAlign: 'center' },
  label: { marginTop: 8, marginBottom: 4 },
  labelValue: { marginVertical: 8, marginBottom: 4, fontFamily: FONTS.POPPINS_LIGHT, fontSize: 12 },
  value: { marginBottom: 4, },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 25,
    marginBottom: 8,
    marginTop: 4,
    fontSize: 16,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelButton: { flex: 1, marginRight: 8, backgroundColor: '#eee', padding: 12, borderRadius: 8, alignItems: 'center' },
  okButton: { flex: 1, marginLeft: 8, backgroundColor: COLORS.PRIMARY, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: 'bold' },
  okText: { color: '#fff', fontWeight: 'bold' },
});

export default AttendanceModal;