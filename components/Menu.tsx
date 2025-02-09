import { useAppTheme } from "@/lib/theme";
import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { exportDB } from "@/lib/exporter";
import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ConfigAtom, saveConfigAtom } from "@/atoms/config";
import { messageAtom } from "@/atoms/message";
import { useRouter } from "expo-router";
import { importDB } from "@/lib/importer";
import * as Updates from "expo-updates";

type MenuProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export default function Menu({ visible, onRequestClose }: MenuProps) {
  const { colors } = useAppTheme();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const config = useAtomValue(ConfigAtom);
  const setMessage = useSetAtom(messageAtom);
  const saveConfig = useSetAtom(saveConfigAtom);
  const router = useRouter();
  async function exportData(exportDirectory: string) {
    setExporting(true);
    const dir = await exportDB(exportDirectory);
    setExporting(false);
    saveConfig("exportDirectory", dir);
    onRequestClose();
    setMessage("エクスポートしました");
  }
  async function importData() {
    Alert.alert("警告", "インポートすると現在のデータが上書きされます", [
      {
        text: "キャンセル",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          setImporting(true);
          await importDB();
          setImporting(false);
          onRequestClose();
          setMessage("インポートしました");
          Updates.reloadAsync();
        },
      },
    ]);
  }
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <View
          onStartShouldSetResponder={(event) => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          style={[
            styles.dialog,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View>
            <Button
              onPress={() => {
                onRequestClose();
                router.push("./search");
              }}
            >
              検索
            </Button>
            <Button
              onPress={() => exportData(config?.exportDirectory)}
              disabled={exporting}
            >
              {exporting ? "エクスポート中..." : "エクスポート"}
            </Button>
            <Button onPress={() => importData()} disabled={importing}>
              {importing ? "インポート中..." : "インポート"}
            </Button>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    padding: 20,
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
