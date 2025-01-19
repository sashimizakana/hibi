import { DiariesAtomFamily } from "@/atoms/diary";
import { useAtom } from "jotai";
import React from "react";
import MarkSelector from "./Marks/MarkSelector";

const markColors = ["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"];
export default function Marks({ date }: { date: string }) {
  const [diary, saveDiary] = useAtom(DiariesAtomFamily(date));
  const marks = diary?.marks || [];

  function toggleMark(color: string) {
    let newMarks = [...marks];
    if (newMarks.includes(color)) {
      newMarks = newMarks.filter((c: any) => c !== color);
    } else {
      newMarks.push(color);
    }
    saveDiary({ marks: newMarks });
  }

  return markColors.map((color) => (
    <MarkSelector
      key={color}
      color={color}
      isActive={marks.includes(color)}
      onToggle={() => toggleMark(color)}
    ></MarkSelector>
  ));
}
