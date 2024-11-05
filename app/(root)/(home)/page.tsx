import WorkoutCard from '@/components/cards/WorkoutCard';
import { getAllTrains } from '@/lib/actions/train.action';
import { SearchParamsProps } from '@/types';

export default async function Home({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;
  const result = await getAllTrains({
    page: resolvedSearchParams?.page ? +resolvedSearchParams.page : 1,
  });

  const trains = result.trains;

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
