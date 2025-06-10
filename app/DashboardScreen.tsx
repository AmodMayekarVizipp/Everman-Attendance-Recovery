import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDefaulterListByOtherId, saveAttendanceTime } from './api/index';
import AttendanceModal from './components/AttendanceModal';
import LogoutModal from './components/LogoutModal';
import ToastShow from './components/ToastShow';
import { COLORS, FONTS } from './constants/common';
import { useSemesterYear } from './store/SemesterYearContext';

const DashboardScreen = () => {
    const { semester, year } = useSemesterYear();
    const router = useRouter();
    const [otherId, setOtherId] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'IN' | 'OUT'>('IN');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [toastProps, setToastProps] = useState<{ type?: string; text1?: string; position?: 'top' | 'bottom'; bottomOffset?: number }>({});
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleSearch = async () => {
        if (!otherId) {
            setToastProps({
                type: 'error',
                text1: 'Please enter ID',
                position: 'bottom',
                bottomOffset: 80,
            });
            return;
        }
        setLoading(true);
        try {
            const data = await getDefaulterListByOtherId({ year, semester, otherId });
            setResults(Array.isArray(data?.data) ? data.data : []);
        } catch (error) {
            setToastProps({
                type: 'error',
                text1: 'Something went wrong',
                position: 'bottom',
                bottomOffset: 80,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (attendanceNote?: string, currentTime?: string) => {
        if (!selectedItem) return;
        setModalLoading(true);
        try {
            await saveAttendanceTime({
                OtherId: selectedItem.OtherId,
                Type: modalType,
                Year: year,
                Semester: semester,
                AttendanceNote: modalType === 'IN' ? attendanceNote : "",
                CurrentTime: currentTime,
            });
            setToastProps({
                type: 'success',
                text1: `Attendance ${modalType === 'IN' ? 'Checked in' : 'Checked out'}!`,
                position: 'bottom',
                bottomOffset: 80,
            });
            setModalVisible(false);
            const data = await getDefaulterListByOtherId({ year, semester, otherId });
            setResults(Array.isArray(data?.data) ? data.data : []);
        } catch {
            setToastProps({
                type: 'error',
                text1: `Something went wrong`,
                position: 'bottom',
                bottomOffset: 80,
            });
        } finally {
            setModalLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.listItemCustom}>
            <Text style={styles.fullNameCustom}>{item.FullName || 'No Name'}</Text>
            <TouchableOpacity
                style={[
                    styles.statusButtonCustom,
                    item.CheckInStatus ? styles.statusButtonOut : styles.statusButtonIn
                ]}
                onPress={() => {
                    setSelectedItem(item);
                    setModalType(item.CheckInStatus ? 'OUT' : 'IN');
                    setModalVisible(true);
                }}
            >
                <Text style={[
                    styles.statusButtonTextCustom,
                    item.CheckInStatus ? styles.statusButtonTextOut : styles.statusButtonTextIn
                ]}>
                    {item.CheckInStatus ? 'Check out' : 'Check in'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.safeArea}>
            <View style={styles.outerContainer}>
                <View style={styles.headerRow}>
                    <View style={styles.profilePicContainer}>
                        <Image
                            source={require('./images/login.png')}
                            style={styles.profilePic}
                        />
                    </View>
                    {/* <TouchableOpacity style={styles.logoutIconButton} onPress={() => router.replace('/LoginScreen')}> */}
                    <TouchableOpacity style={styles.logoutIconButton} onPress={() => setLogoutModalVisible(true)}>
                        <Ionicons name="log-out-outline" size={28} color="#F66C6C" />
                    </TouchableOpacity>
                </View>

                {/* Center: Year/Semester Box */}
                <View style={styles.semYearBox}>
                    <Text style={styles.semYearLabel}>Year</Text>
                    <Text style={styles.semYearValue}>{year}</Text>
                    <View style={styles.semYearDivider} />
                    <Text style={styles.semYearLabel}>Semester</Text>
                    <Text style={styles.semYearValue}>{semester}</Text>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Enter other ID"
                        value={otherId}
                        onChangeText={setOtherId}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                        disabled={loading}
                    >
                        <Text style={styles.searchButtonText}>{loading ? 'Searching...' : 'Search'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.resultsContainer}>
                    {results.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Image source={require('./images/nodata.png')} style={styles.noDataImage} resizeMode="contain" />
                            <Text style={styles.noDataText}>No Data Available</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={renderItem}
                            style={{ width: '100%' }}
                        />
                    )}
                </View>
                <AttendanceModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    loading={modalLoading}
                    data={{
                        FullName: selectedItem?.FullName || '',
                        ParentEmail: selectedItem?.ParentEmail || '',
                    }}
                    type={modalType}
                    onOk={handleAttendance}
                />
                <LogoutModal
                    visible={logoutModalVisible}
                    onConfirm={() => {
                        setLogoutModalVisible(false);
                        router.replace('/LoginScreen');
                    }}
                    onCancel={() => setLogoutModalVisible(false)}
                />
            </View>
            <ToastShow {...toastProps} onHide={() => setToastProps({})} />
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: COLORS.WHITE,
    },
    outerContainer: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        margin: 15,
        padding: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 16,
        paddingHorizontal: 8,
    },
    profilePicContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    profilePic: {
        width: 44,
        height: 44,
        borderRadius: 22,
        resizeMode: 'cover',
    },
    semYearBox: {
        marginTop: 8,
        alignItems: 'center',
        backgroundColor: '#F5F4FB',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 18,
        shadowColor: '#7B6CF6',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 1,
        borderColor: '#E5E5F6',
        flexDirection: 'row',
    },
    semYearLabel: {
        color: '#7B6CF6',
        fontSize: 15,
        marginRight: 6,
        marginLeft: 6,
        fontFamily: FONTS.POPPINS_MEDIUM
    },
    semYearValue: {
        color: '#222',
        fontSize: 16,
        marginRight: 10,
        marginLeft: 2,
        fontFamily: FONTS.POPPINS_REGULAR
    },
    semYearDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E5F6',
        marginHorizontal: 10,
        borderRadius: 1,
    },
    logoutIconButton: {
        padding: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        shadowColor: '#F66C6C',
        shadowOpacity: 0.10,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    searchContainer: {
        width: '100%',
        padding: 12,
        alignItems: 'center',
    },
    searchBox: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 12,
        fontSize: 15,
        marginBottom: 12,
    },
    searchButton: {
        width: '100%',
        backgroundColor: '#7B6CF6',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.POPPINS_MEDIUM
    },
    resultsContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        marginTop: 8,
        alignItems: 'center',
        padding: 8,
    },
    noDataContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 300,
    },
    noDataImage: {
        width: 250,
        height: 200,
        marginBottom: 12,
    },
    noDataText: {
        color: '#222',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: FONTS.POPPINS_MEDIUM
    },
    listItemCustom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 18,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    fullNameCustom: {
        fontSize: 16,
        color: '#222',
        fontFamily: FONTS.POPPINS_MEDIUM,
        flex: 1,
    },
    statusButtonCustom: {
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 18,
        marginLeft: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    statusButtonIn: {
        backgroundColor: '#F5F4FB',
        borderColor: '#7B6CF6',
    },
    statusButtonOut: {
        backgroundColor: '#FFF0F0',
        borderColor: '#F66C6C',
    },
    statusButtonTextCustom: {
        fontFamily: FONTS.POPPINS_MEDIUM,
        fontSize: 14,
        textAlign: 'center',
    },
    statusButtonTextIn: {
        color: '#7B6CF6',
    },
    statusButtonTextOut: {
        color: '#F66C6C',
    },
});

export default DashboardScreen;
