import { StatusBar, StyleSheet } from "react-native";
import metrics from "../../../Constants/Metrics";
import { AllColors } from "../../../Constants/COLORS";
import { Fonts, fontSize } from "../../../Constants/Fonts";

export const styles = StyleSheet.create({
    containerView: { flex: 1 },
    viewHeader: { marginBottom: metrics.hp1, marginTop: metrics.hp0_5 },
    safeAreaView: {
        height: '100%',
    },
    viewGradient: { height: 10, width: '100%' },
    viewTop: { backgroundColor: AllColors.white, padding: metrics.hp2, marginHorizontal: metrics.hp2, marginTop: metrics.hp2, borderRadius: metrics.hp1 },
    viewBtwn: { flexDirection: 'row', justifyContent: "space-between", },
    textStatus: { fontFamily: Fonts.AfacadSemibold, fontSize: fontSize(11), color: AllColors.black },
    textId: { fontFamily: Fonts.AfacadBold, fontSize: fontSize(14), color: AllColors.black, width: '80%' },
    viewItemMid: { flexDirection: 'row', justifyContent: "space-between", marginVertical: metrics.hp0_5 },
    textTime: { fontFamily: Fonts.AfacadRegular, fontSize: fontSize(11), color: "#5B698A", marginLeft: metrics.hp0_5 },
    textSubject: { fontFamily: Fonts.AfacadRegular, fontSize: fontSize(12), color: AllColors.black, width: '75%' },
    viewOnlyRow: { flexDirection: 'row', alignItems: "center", },
    viewFlatLit: { marginTop: 0, paddingHorizontal: 0, flex: 1 },

    viewMessage: { marginVertical: metrics.hp0_5, paddingVertical: metrics.hp1, paddingHorizontal: metrics.hp2, borderRadius: 10, maxWidth: '70%', marginHorizontal: metrics.hp3, borderTopRightRadius: 0, justifyContent: 'center' },
    viewLine: { backgroundColor: AllColors.lightGray, height: 1, flex: 1, marginVertical: metrics.hp2 },
    textDate: { fontFamily: Fonts.AfacadRegular, fontSize: fontSize(12), color: AllColors.lightGray, marginHorizontal: 10 },
    textMsg: { fontFamily: Fonts.AfacadRegular, fontSize: fontSize(12), },
    viewMsgContainer: { flexDirection: "row", justifyContent: "space-between" },
    textHours: { fontFamily: Fonts.AfacadRegular, fontSize: fontSize(12), alignSelf: 'flex-end' },

    viewInput: { paddingHorizontal: metrics.hp2, flexDirection: "row",  paddingBottom: 20, paddingTop: 10 },
    viewTextInput: { flex: 0.85 },
    viewSend: { height: metrics.hp7, backgroundColor: AllColors.white, flex: 0.15, borderTopRightRadius: metrics.hp4, borderBottomRightRadius: metrics.hp4, justifyContent: "center", alignItems: "center", flexDirection: 'row' },
    textInput: { height: metrics.hp7, backgroundColor: AllColors.white, borderTopLeftRadius: metrics.hp4, borderBottomLeftRadius: metrics.hp4, paddingHorizontal: metrics.hp2, color: AllColors.black, fontFamily: Fonts.AfacadRegular, fontSize: fontSize(14) },
    viewSendBtn: { borderRadius: metrics.hp3, height: metrics.hp5_5, width: metrics.hp5_5, justifyContent: "center", alignItems: "center" },

    textOR: { color: "#8791AB", fontSize: fontSize(12), fontFamily: Fonts.AfacadRegular, marginVertical: metrics.hp2, marginHorizontal: metrics.hp1 },
    viewDivid: { justifyContent: "center", flexDirection: "row", alignItems: "center" },
    viewLineDiv: { height: 1, backgroundColor: "#3B4C75", flex: 0.4 },

    TopTipView: { bottom: 41 },
    happyEmoji: { alignSelf: 'center', top: 5 },
    atext: { color: '#082350', fontFamily: Fonts.AfacadSemibold, fontSize: fontSize(18), right: 10 },

    setAdminProfile: { bottom: metrics.hp7 },
    adminImg: { height: metrics.hp3, width: metrics.hp3, borderRadius: metrics.hp1_5 },

    //dotMenu
    dotViewContainer: { position: 'absolute', zIndex: 5, height: '100%', width: '100%', backgroundColor: "transparent", top: StatusBar.currentHeight, },
    viewDotMenu: {
        backgroundColor: AllColors.white, position: 'absolute', padding: metrics.hp2, right: metrics.hp4, zIndex: 10, top: metrics.hp5, borderRadius: metrics.hp1,
        shadowColor: AllColors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4.65,
        elevation: 8,
    },
    viewRow: { flexDirection: "row", alignItems: "center" },
    textClose: { fontFamily: Fonts.AfacadRegular, color: AllColors.black, fontSize: fontSize(14), marginLeft: metrics.hp0_5 }

});