import { deleteTodoAtom, saveTodoAtom } from "@/atoms/todo";
import { todos } from "@/db/schema";
import { useAppTheme } from "@/lib/theme";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
type Todo = typeof todos.$inferSelect;
export default function TodoEditor({
  todo,
  date,
}: {
  todo: Todo;
  date: string;
}) {
  const { colors } = useAppTheme();
  const [editing, setEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(todo.task);
  const saveTodo = useSetAtom(saveTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);
  async function setDone(done: boolean) {
    const doneAt = done ? date : "";
    await saveTodo({ ...todo, date: doneAt, done: done ? 1 : 0 });
  }
  useEffect(() => {
    setEditingTask(todo.task);
  }, [todo]);
  function save() {
    saveTodo({ ...todo, task: editingTask });
    setEditing(false);
  }
  async function remove() {
    deleteTodo(todo.id);
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
        value={editingTask || ""}
        onChangeText={setEditingTask}
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
        status={todo.done ? "checked" : "unchecked"}
        onPress={() => setDone(!todo.done)}
      ></Checkbox>
      <Button onPress={() => setEditing(true)} textColor={colors.primary}>
        {todo.task}
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
