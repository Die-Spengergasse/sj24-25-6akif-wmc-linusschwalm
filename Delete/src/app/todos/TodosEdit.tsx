import React, { Dispatch, FormEvent, useEffect, useImperativeHandle, useRef, useState, SetStateAction } from "react";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { Category } from "@/app/types/Category";
import styles from "./TodosEdit.module.css";
import { TodoItem } from "../types/TodoItem";

export type TodoEditRef = {
  startSubmit: () => void;
}

type CategoryEditProps = {
  todoItem: TodoItem;
  onSubmitted: () => void;
  ref?: React.Ref<TodoEditRef>; // Ref as prop
}

async function handleSubmit(
  event: FormEvent,
  setError: Dispatch<SetStateAction<ErrorResponse>>,
  onSubmitted: () => void
) {
  event.preventDefault();
  /*const response = await editTodo(new FormData(event.target as HTMLFormElement));
  if (isErrorResponse(response)) {
    setError(response);
  } else {
    onSubmitted();
  }*/
}

export default function TodosEdit(props: CategoryEditProps) {
  const { todoItem, onSubmitted, ref } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());

  // UseImperativeHandle for custom methods exposed to the parent
  useImperativeHandle(ref, () => ({
    startSubmit: () => {
      formRef.current?.requestSubmit();
    },
  }));

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e, setError, onSubmitted)}
        ref={formRef}
        className={styles.categoryEdit}
      >
        <input type="hidden" name="guid" value={todoItem.guid} />
        <div>
          <div>Title</div>
          <div>
            <input type="text" name="title" defaultValue={todoItem.title} required />
          </div>
          <div>
            {error.validations.name && (
              <span className={styles.error}>{error.validations.name}</span>
            )}
          </div>
        </div>
        <div>
          <div>Description</div>
          <div>
            <textarea name="description" defaultValue={todoItem.description} required />
          </div>
          <div>
            {error.validations.description && (
              <span className={styles.error}>{error.validations.description}</span>
            )}
          </div>
        </div>
        <div>
          <div>
            {error.validations.priority && (
              <span className={styles.error}>{error.validations.priority}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
