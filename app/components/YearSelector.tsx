import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../constants/common';

interface YearSelectorProps {
    selectedYear: string;
    setSelectedYear: (y: string) => void;
    visible: boolean;
    setVisible: (v: boolean) => void;
    years: { label: string; value: string }[];
}

const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, setSelectedYear, visible, setVisible, years }) => (
    <>
        <TouchableOpacity style={{ width: '100%' }} onPress={() => setVisible(true)}>
            <LinearGradient
                colors={['#E5F0FF', '#B8E0FF']}
                style={styles.yearButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.yearButtonText}>Year {selectedYear}</Text>
            </LinearGradient>
        </TouchableOpacity>
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.yearModalContent}>
                    <Text style={styles.modalTitle}>Select Year</Text>
                    <ScrollView style={styles.yearListScroll}>
                        {years.map((y) => (
                            <Pressable
                                key={y.value}
                                style={[styles.yearListItem, selectedYear === y.value && styles.yearListItemSelected]}
                                onPress={() => { setSelectedYear(y.value); setVisible(false); }}
                            >
                                <Text style={styles.yearListIcon}>🗓</Text>
                                <Text style={[styles.yearListLabel, selectedYear === y.value && styles.yearListLabelSelected]}>{y.label}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Pressable style={{ width: "100%", alignItems: 'center' }} onPress={() => setVisible(false)}>
                        <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </>
);

const styles = StyleSheet.create({
    yearButton: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginBottom: 18,
        width: '100%',
        alignItems: 'center',
    },
    yearButtonText: {
        color: '#3D2B7B',
        fontSize: 17,
        fontFamily: FONTS.POPPINS_REGULAR
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    yearModalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        alignItems: 'center',
        marginHorizontal: 0,
        marginBottom: 0,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 16,
        fontFamily: FONTS.POPPINS_REGULAR
    },
    yearListScroll: {
        width: '100%',
        marginVertical: 12,
    },
    yearListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        marginBottom: 14,
        borderWidth: 2,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    yearListItemSelected: {
        borderColor: '#3D2B7B',
        backgroundColor: '#E5F0FF',
        shadowColor: '#3D2B7B',
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    yearListIcon: {
        fontSize: 28,
        marginRight: 16,
    },
    yearListLabel: {
        fontSize: 18,
        color: '#222',
        fontWeight: '600',
    },
    yearListLabelSelected: {
        color: '#3D2B7B',
        fontFamily: FONTS.POPPINS_MEDIUM
    },
    closeText: {
        color: '#888',
        marginTop: 16,
        fontSize: 16,
        fontFamily: FONTS.POPPINS_REGULAR
    },
});

export default YearSelector;
