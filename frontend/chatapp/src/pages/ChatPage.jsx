import { useParams } from 'react-router-dom'
import { ChatScreen } from '../../Screen/chatScreen'

export function ChatPage() {
  const { chatId } = useParams()
  const chat = {
    id: chatId,
    name: `Chat ${chatId}`,
    photo: 'https://via.placeholder.com/40',
    online: true
  }

  return (
    <ChatScreen 
      chat={chat} 
      onBack={() => window.history.back()}
    />
  )
}
