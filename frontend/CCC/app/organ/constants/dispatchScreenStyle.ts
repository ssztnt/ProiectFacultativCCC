import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 5,
        paddingTop: 40,
    },
    subtitle: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    teamsContainer: {
        flex: 1,
    },
    teamWrapper: {
        marginBottom: 10,
    },
    teamTouchable: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    teamCard: {
        borderRadius: 20,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
    },
    selectedCard: {
        borderColor: '#ffffff30',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
    },
    teamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    teamHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamIcon: {
        fontSize: 25,
        marginRight: 12,
    },
    teamName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    teamCode: {
        fontSize: 10,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    membersSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    membersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    memberChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    memberName: {
        fontSize: 10,
        fontWeight: '500',
    },
    detailsSection: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        fontSize: 12,
        marginRight: 12,
        width: 20,
    },
    detailText: {
        fontSize: 10,
        fontWeight: '500',
        flex: 1,
    },
    deployButton: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    deployButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffff30',
    },
    deployButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
});
