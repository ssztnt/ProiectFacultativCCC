import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LegalModalProps {
    visible: boolean;
    type: 'terms' | 'privacy';
    onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ visible, type, onClose }) => {
    const termsContent = `TERMENI ȘI CONDIȚII

1. ACCEPTAREA TERMENILOR
Prin utilizarea acestei aplicații, confirmați că acceptați acești termeni și condiții în totalitate. Dacă nu sunteți de acord cu aceștia, vă rugăm să nu utilizați aplicația.

2. DESCRIEREA SERVICIULUI
Aplicația noastră oferă servicii faine. Ne rezervăm dreptul de a modifica sau întrerupe serviciul în orice moment, cu sau fără notificare prealabilă.

3. CONTUL UTILIZATORULUI
- Sunteți responsabil pentru menținerea confidențialității contului dvs.
- Sunteți responsabil pentru toate activitățile care au loc sub contul dvs.
- Trebuie să ne notificați imediat despre orice utilizare neautorizată

4. UTILIZAREA ACCEPTABILĂ
Nu puteți utiliza serviciul pentru:
- Activități ilegale sau neautorizate
- Încălcarea drepturilor de autor sau proprietate intelectuală
- Transmiterea de conținut dăunător sau ofensator
- Interferarea cu securitatea serviciului

5. PROPRIETATEA INTELECTUALĂ
Toate drepturile de proprietate intelectuală asupra aplicației și conținutului acesteia ne aparțin sau licențiatorilor noștri.

6. LIMITAREA RĂSPUNDERII
În măsura permisă de lege, nu vom fi răspunzători pentru daune directe, indirecte, incidentale sau consecvențiale rezultate din utilizarea serviciului.

7. MODIFICĂRI ALE TERMENILOR
Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor intra în vigoare la publicarea lor în aplicație.

8. LEGEA APLICABILĂ
Acești termeni sunt guvernați de legile din România.

9. CONTACT
Pentru întrebări despre acești termeni, ne puteți contacta la: danidanrares@muresului42.com;`;

    const privacyContent = `POLITICA DE CONFIDENȚIALITATE
1. INTRODUCERE
Această politică de confidențialitate descrie cum colectăm, utilizăm și protejăm informațiile dvs. personale.

2. INFORMAȚIILE PE CARE LE COLECTĂM
Colectăm următoarele tipuri de informații:
- Informații de cont (nume, email, parolă)
- Informații de profil (fotografii, preferințe)
- Date de utilizare (activitatea în aplicație, preferințe)
- Informații tehnice (adresa IP, tipul dispozitivului)

3. CUM UTILIZĂM INFORMAȚIILE
Utilizăm informațiile pentru:
- Furnizarea și îmbunătățirea serviciilor
- Personalizarea experienței utilizatorului
- Comunicarea cu utilizatorii
- Securitatea și prevenirea fraudelor
- Respectarea obligațiilor legale

4. PARTAJAREA INFORMAȚIILOR
Nu vindem, închiriem sau partajăm informațiile personale cu terțe părți, cu excepția:
- Furnizorilor de servicii de încredere
- Cerințelor legale
- Protejării drepturilor noastre sau ale utilizatorilor

5. SECURITATEA DATELOR
Implementăm măsuri de securitate adecvate pentru protejarea informațiilor:
- Criptarea datelor în tranzit și în repaus
- Control strict al accesului
- Monitorizarea continuă a sistemelor
- Actualizări regulare de securitate

6. DREPTURILE UTILIZATORILOR
Aveți următoarele drepturi:
- Accesul la informațiile personale
- Rectificarea datelor inexacte
- Ștergerea datelor (dreptul la uitare)
- Portabilitatea datelor
- Opoziția față de prelucrare

7. COOKIES ȘI TEHNOLOGII SIMILARE
Utilizăm cookies pentru:
- Funcționarea aplicației
- Analitica și îmbunătățirea serviciilor
- Personalizarea conținutului

8. TRANSFERURI INTERNAȚIONALE
Datele pot fi transferate în afara României, respectând standardele de protecție adecvate.

9. REȚINEREA DATELOR
Păstrăm datele personale doar pentru perioada necesară îndeplinirii scopurilor pentru care au fost colectate.

10. MODIFICĂRI ALE POLITICII
Vom notifica utilizatorii despre modificările semnificative ale acestei politici.

11. CONTACT
Pentru întrebări despre confidențialitate, contactați-ne la: danidanrares@muresului42.com`;

    const getContent = () => {
        return type === 'terms' ? termsContent : privacyContent;
    };

    const getTitle = () => {
        return type === 'terms' ? 'Termeni și Condiții' : 'Politica de Confidențialitate';
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{getTitle()}</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <Text style={styles.contentText}>
                        {getContent()}
                    </Text>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f8f8f8',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    contentText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#444',
        textAlign: 'justify',
    },
});

export default LegalModal;