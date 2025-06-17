// Dynamic imports to avoid blocking login page
let SockJS: any = null;
let Client: any = null;

// Lazy load dependencies
const loadDependencies = async () => {
  if (!SockJS || !Client) {
    const [sockjsModule, stompModule] = await Promise.all([
      import('sockjs-client'),
      import('@stomp/stompjs')
    ]);
    SockJS = sockjsModule.default;
    Client = stompModule.Client;
  }
  return { SockJS, Client };
};

let stompClient: any = null;
let connectionCallbacks: {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: any) => void;
} = {};

export interface WebSocketMessage {
  id?: string;
  senderId: string;
  senderName?: string;
  receiverId?: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'EMOJI' | 'SYSTEM';
  timestamp?: string;
  chatRoomId?: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'STOP_TYPING';
}

// Get WebSocket URL from environment variables
const getWebSocketUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${apiBaseUrl}/ws-chat`;
};

export const connectSocket = async (
  firebaseUid: string,
  token: string,
  callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: any) => void;
    onMessage?: (message: any) => void;
  } = {}
) => {
  try {
    // Load dependencies dynamically
    const { SockJS: SockJSClass, Client: ClientClass } = await loadDependencies();
    
    if (stompClient && stompClient.connected) {
      console.log("WebSocket already connected");
      return;
    }

    connectionCallbacks = callbacks;
    
    const wsUrl = getWebSocketUrl();
    console.log("🔌 Connecting to WebSocket at:", wsUrl);
    const socket = new SockJSClass(wsUrl);

    stompClient = new ClientClass({
      webSocketFactory: () => socket,
      connectHeaders: { 
        Authorization: `Bearer ${token}`,
        "Firebase-UID": firebaseUid
      },
      
      onConnect: () => {
        console.log("✅ WebSocket connected");
        
        // Subscribe to public topic for general chat
        stompClient?.subscribe("/topic/public", (message: any) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log("📨 Received message:", parsedMessage);
            connectionCallbacks.onMessage?.(parsedMessage);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        // Subscribe to user-specific messages
        stompClient?.subscribe(`/user/${firebaseUid}/queue/messages`, (message: any) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log("📨 Received private message:", parsedMessage);
            connectionCallbacks.onMessage?.(parsedMessage);
          } catch (error) {
            console.error("Error parsing private message:", error);
          }
        });

        // Notify user joined
        joinChat(firebaseUid);
        
        connectionCallbacks.onConnect?.();
      },

      onDisconnect: () => {
        console.log("❌ WebSocket disconnected");
        connectionCallbacks.onDisconnect?.();
      },

      onStompError: (frame: any) => {
        console.error("❌ WebSocket STOMP error:", frame);
        connectionCallbacks.onError?.(frame);
      },

      onWebSocketError: (event: any) => {
        console.error("❌ WebSocket error:", event);
        connectionCallbacks.onError?.(event);
      },

      debug: (str: string) => {
        console.log("🔧 WebSocket debug:", str);
      }
    });

    stompClient.activate();
  } catch (error) {
    console.error("Failed to load WebSocket dependencies:", error);
    connectionCallbacks.onError?.(error);
  }
};

export const sendMessage = (message: WebSocketMessage) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket not connected");
    return false;
  }

  try {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        ...message,
        type: 'CHAT',
        timestamp: new Date().toISOString()
      }),
    });
    console.log("📤 Message sent:", message);
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export const joinChat = (firebaseUid: string) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket not connected");
    return;
  }

  try {
    stompClient.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify({
        senderId: firebaseUid,
        type: 'JOIN',
        content: '',
        messageType: 'SYSTEM'
      }),
    });
  } catch (error) {
    console.error("Error joining chat:", error);
  }
};

export const sendTypingIndicator = (firebaseUid: string) => {
  if (!stompClient || !stompClient.connected) {
    return;
  }

  try {
    stompClient.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({
        senderId: firebaseUid,
        type: 'TYPING',
        content: '',
        messageType: 'SYSTEM'
      }),
    });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
  }
};

export const sendStopTypingIndicator = (firebaseUid: string) => {
  if (!stompClient || !stompClient.connected) {
    return;
  }

  try {
    stompClient.publish({
      destination: "/app/chat.stopTyping",
      body: JSON.stringify({
        senderId: firebaseUid,
        type: 'STOP_TYPING',
        content: '',
        messageType: 'SYSTEM'
      }),
    });
  } catch (error) {
    console.error("Error sending stop typing indicator:", error);
  }
};

export const disconnectSocket = () => {
  if (stompClient) {
    console.log("🔌 Disconnecting WebSocket");
    stompClient.deactivate();
    stompClient = null;
  }
};

export const isConnected = () => {
  return stompClient && stompClient.connected;
};
