import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Info } from 'lucide-react';
import Image from 'next/image';
import { formatTimestampToDate } from '@/lib/utils';

interface WorkoutElement {
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
}

export default function WorkoutCard({ el }: { el: WorkoutElement }) {
  return (
    <Card className='w-full max-w-md mx-auto mb-6'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
        <CardTitle className='text-sm font-medium flex'>
          <Badge className='mr-2 text-base'>{el.wod_class}</Badge>
        </CardTitle>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Calendar className='mr-1 h-4 w-4' />
          {formatTimestampToDate(el.day)}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {el.wod.map(
            (
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
              },
              i
            ) => {
              const formatDescription = (des: string) => {
                let description = des.split('<br />\n');
                description = description.map((des: string) =>
                  des
                    .replaceAll('&quot;', '"')
                    .replaceAll('<br />', '')
                    .replaceAll('&amp;', '&')
                );

                return description.filter((des: string) => des.length !== 1);
              };
              const description = formatDescription(wod.description);
              return (
                <div key={`${el._id}-${wod.id}-${i}`}>
                  <h4 className='font-semibold'>{wod.title}</h4>
                  {description.map((line: string, i: number) => {
                    if (
                      wod.title &&
                      description.length === 1 &&
                      description[0].length !== 0
                    ) {
                      return (
                        <p
                          className='text-sm text-muted-foreground flex items-center'
                          key={`${el._id}-${line}-${i}`}
                        >
                          <Info className='h-4 w-4 mr-1' /> {line}
                        </p>
                      );
                    }
                    if (!wod.title && i === 0) {
                      return (
                        <h4
                          className='font-semibold'
                          key={`${el._id}-${line}-${i}`}
                        >
                          {line}
                        </h4>
                      );
                    }
                    return (
                      <p
                        className='text-sm text-muted-foreground'
                        key={`${el._id}-${line}-${i}`}
                      >
                        {line}
                      </p>
                    );
                  })}

                  <ul className='list-disc list-inside text-sm'>
                    {wod.exercises.map(
                      (
                        exercise: {
                          id: string;
                          reps: number;
                          name: string;
                        },
                        i
                      ) => {
                        return (
                          <li key={`${el._id}-${exercise.id}-${i}`}>
                            {exercise.reps} {exercise.name}
                          </li>
                        );
                      }
                    )}
                  </ul>
                  <div className='flex flex-wrap gap-2 my-4'>
                    {wod.exercises.map(
                      (
                        exercise: {
                          id: string;
                          reps: number;
                          name: string;
                          img: string;
                        },
                        i
                      ) => {
                        if (!exercise.img) return;
                        return (
                          <Image
                            src={exercise.img}
                            height={60}
                            width={80}
                            alt={exercise.name}
                            className='rounded'
                            key={`${el._id}-image-${exercise.id}-${i}`}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}
