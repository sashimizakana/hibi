import { DiariesAtomFamily } from "@/atoms/diary";
import { deleteTaskAtom, saveTaskAtom } from "@/atoms/task";
import { tasks } from "@/db/schema";
import { useAppTheme } from "@/lib/theme";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Checkbox, IconButton, TextInput } from "react-native-paper";
type Task = typeof tasks.$inferSelect;

export default function TaskEditor({
  task,
  date,
}: {
  task: Task;
  date: string;
}) {
  const { colors } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState(task?.name || "");
  const [diary, saveDiary] = useAtom(DiariesAtomFamily(date));
  const tasks = diary?.tasks || [];
  const [taskDone, setTaskDone] = useState(tasks.includes(task.id));
  const saveTask = useSetAtom(saveTaskAtom);
  const deleteTask = useSetAtom(deleteTaskAtom);

  useEffect(() => {
    setEditingName(task?.name || "");
  }, [task]);
  useEffect(() => {
    setTaskDone(tasks.includes(task.id));
  }, [tasks]);
  function save() {
    saveTask({ ...task, name: editingName });
    setEditing(false);
  }
  async function remove() {
    deleteTask(task.id);
  }
  function toggleDone(flag: boolean) {
    let newTasks = [...tasks];
    if (flag) {
      newTasks.push(task.id);
    } else {
      newTasks = newTasks.filter((id: number) => id !== task.id);
    }
    saveDiary({ tasks: newTasks });
  }
  return editing ? (
    <View style={styles.inputContainer}>
      <IconButton
        icon="close"
        iconColor={colors.secondary}
        onPress={() => setEditing(false)}
      ></IconButton>
      <TextInput
        style={{ flex: 1, backgroundColor: "transparent" }}
        value={editingName || ""}
        onChangeText={setEditingName}
      ></TextInput>
      <IconButton
        icon="delete"
        iconColor={colors.error}
        onPress={remove}
      ></IconButton>
      <IconButton
        icon="content-save"
        iconColor={colors.primary}
        onPress={save}
      ></IconButton>
    </View>
  ) : (
    <View style={styles.inputContainer}>
      <Checkbox
        status={taskDone ? "checked" : "unchecked"}
        onPress={() => toggleDone(!taskDone)}
      ></Checkbox>
      <Button onPress={() => setEditing(true)} textColor={colors.primary}>
        {task.name}
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
