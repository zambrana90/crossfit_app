import WorkoutCard from '@/components/cards/WorkoutCard';
import { getRandomTrains } from '@/lib/actions/train.action';

export default async function Page() {
  const result = await getRandomTrains();

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
      {trains.map((el: ElElement) => (
        <WorkoutCard el={el} key={el._id} />
      ))}
    </>
  );
}
