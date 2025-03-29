// Create an interface to declare shape of a task. Similar to a .h file in ways
export interface TaskInterface {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    priority: string;
    status: string;
}