import { TrailDetailModal } from "@/features/trails/screens/TrailDetailModal";
import { useLocalSearchParams } from "expo-router/build/hooks";




export default function Page() {
    const {id} = useLocalSearchParams<{ id: string }>();
  return <TrailDetailModal  trailId = {id}/>;
}