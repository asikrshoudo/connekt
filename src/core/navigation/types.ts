export type RootStackParamList = {
  Tabs: undefined;
  Conversation: { conversationId: string };
  Permissions: undefined;
  Scan: undefined;
  NewChat: undefined;
  AddContact: undefined;
  MediaViewer: { uri: string; kind: 'image' | 'video' };
  ContactProfile: { conversationId: string };
  Requests: undefined;
  RequestDetail: { requestId: string };
};
