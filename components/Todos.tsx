import _ from "lodash";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useAppTheme } from "@/lib/theme";
import { IconButton, TextInput } from "react-native-paper";
import { fetchTodosAtom, saveTodoAtom, todosAtom } from "@/atoms/todo";
import TodoEditor from "./Todos/TodoEditor";

export default function Todos({ date }: { date: string }) {
  const { colors } = useAppTheme();
  const todos = useAtomValue(todosAtom);
  const saveTodo = useSetAtom(saveTodoAtom);
  const [newTodo, setNewTodo] = useState("");
  const fetchTodos = useSetAtom(fetchTodosAtom);
  function add() {
    saveTodo({
      task: newTodo,
      date: "",
      done: 0,
    });
    setNewTodo("");
  }
  useEffect(() => {
    fetchTodos(date);
  }, [date]);
  return (
    <View>
      {todos.map((todo, i) => {
        return <TodoEditor todo={todo} date={date} key={i}></TodoEditor>;
      })}
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
          value={newTodo}
          outlineColor="transparent"
          underlineColor={colors.secondary}
          textColor={colors.text}
          onChangeText={setNewTodo}
        />
        <IconButton icon="plus" iconColor={colors.primary} onPress={add} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  todoContainer: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 10,
  },
});
