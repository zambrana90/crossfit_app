import WorkoutCard from '@/components/cards/WorkoutCard';
import { getPartnerTrains } from '@/lib/actions/train.action';

export default async function Page() {
  const result = await getPartnerTrains();

  const trains = result;

  type ElElement = {
    _id: string;
    wod_class: string;
    day: number;
    wod: {
      id: string;
      title: string;
      description: string;
      exercises: {
        id: string;
        reps: number;
        name: string;
        img: string;
      }[];
    }[];
  };

  return (
    <>
      {trains?.map((el: ElElement) => (
        <WorkoutCard el={el} key={el._id} />
      ))}
    </>
  );
}
