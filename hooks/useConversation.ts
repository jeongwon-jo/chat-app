import { useParams } from "next/navigation"
import { useMemo } from "react";

const useConverSation = () => {
  const params = useParams()

  const conversationId = useMemo( () => {
    if (!params?.conversationId) {
      return "";
    } 

    return params.conversationId as string
  }, [params?.conversationId])

  const isOpen = !!conversationId;

  return { conversationId, isOpen };
}

export default useConverSation