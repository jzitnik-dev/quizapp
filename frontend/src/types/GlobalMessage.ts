export default interface GlobalMessage {
  markdownContent: string;
  type: "DANGER" | "WARNING" | "INFO";
}
