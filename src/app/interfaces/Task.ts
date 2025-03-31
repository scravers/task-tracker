// Create an interface to declare shape of a task. Similar to a .h file in ways
export interface TaskInterface {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in_progress" | "completed";
    isEditing: boolean;
}