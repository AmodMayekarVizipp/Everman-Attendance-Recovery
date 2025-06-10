import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../constants/common';

interface SemesterSelectorProps {
    selectedSemester: string;
    setSelectedSemester: (s: string) => void;
    visible: boolean;
    setVisible: (v: boolean) => void;
    semesters: { label: string; value: string }[];
}

const SemesterSelector: React.FC<SemesterSelectorProps> = ({ selectedSemester, setSelectedSemester, visible, setVisible, semesters }) => (
    <>
        <TouchableOpacity style={{ width: '100%' }} onPress={() => setVisible(true)}>
            <LinearGradient
                colors={['#F8E0C7', '#F6CBA3']}
                style={styles.semesterButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.semesterButtonText}>🍂 Semester {selectedSemester}</Text>
            </LinearGradient>
        </TouchableOpacity>
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.semesterModalContent}>
                    <Text style={styles.modalTitle}>Select Semester</Text>
                    <View style={styles.semesterOptionsRow}>
                        {semesters.map((s) => (
                            <Pressable
                                key={s.value}
                                style={[styles.semesterCard, selectedSemester === s.value && styles.semesterCardSelected]}
                                onPress={() => { setSelectedSemester(s.value); setVisible(false); }}
                            >
                                <Text style={styles.semesterEmoji}>{s.value === 'Fall' ? '🍂' : '🌸'}</Text>
                                <Text style={styles.semesterCardLabel}>{s.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={{ width: "100%", alignItems: 'center' }} onPress={() => setVisible(false)}>
                        <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </>
);

const styles = StyleSheet.create({
    semesterButton: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginBottom: 14,
        width: '100%',
        alignItems: 'center',
    },
    semesterButtonText: {
        color: '#A86B2E',
        fontSize: 17,
        fontFamily: FONTS.POPPINS_REGULAR
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    semesterModalContent: {
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
        fontFamily: FONTS.POPPINS_MEDIUM
    },
    semesterOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        gap: 18,
    },
    semesterCard: {
        width: 140,
        height: 160,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    semesterCardSelected: {
        borderColor: '#7B6CF6',
        shadowColor: '#7B6CF6',
        shadowOpacity: 0.18,
        shadowRadius: 12,
    },
    semesterEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    semesterCardLabel: {
        fontWeight: '600',
        color: '#222',
        fontFamily: FONTS.POPPINS_REGULAR
    },
    closeText: {
        color: '#888',
        marginTop: 16,
        fontSize: 16,
        fontFamily: FONTS.POPPINS_REGULAR
    },
});

export default SemesterSelector;
