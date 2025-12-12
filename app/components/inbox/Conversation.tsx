"use client";

import { useRouter } from "next/navigation";

export interface UserType {
    id: string;
    name: string;
    avatar_url: string;
}

export interface ConversationType {
    id: string;
    users: UserType[];
}

interface ConversationProps {
    conversation: ConversationType;
    userId: string;
}

const Conversation: React.FC<ConversationProps> = ({
    conversation,
    userId
}) => {
    const router = useRouter();
    const otherUser = conversation.users.find((user) => user.id !== userId);

    return (
        <div 
            className="px-6 py-4 cursor-pointer border border-gray-300 rounded-xl"
            onClick={() => router.push(`/inbox/${conversation.id}`)}
        >
            <p className="mb-6 text-xl">{otherUser?.name}</p>

            <p className="text-airbnb-dark">
                Go to conversation
            </p>
        </div>
    );
};

export default Conversation;
