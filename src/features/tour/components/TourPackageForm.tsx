// import { useForm } from 'react-hook-form';
// import { TourMap } from './TourMap/TourMap';
// import { useCreateTour } from '../hooks/useTours';

// type Props = {
//   onSuccess?: () => void;
// };

// export const TourPackageForm = ({ onSuccess }: Props) => {
//   const { register, handleSubmit, control } = useForm<TourPackage>();
//   const { mutate } = useCreateTour();

//   const onSubmit = (data: TourPackage) => {
//     mutate(data, {
//       onSuccess: () => onSuccess?.()
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* Basic Fields */}
//       <input {...register('title')} placeholder="Tour title" />
//       <textarea {...register('description')} />

//       {/* Map Integration */}
//       <Controller
//         name="stops"
//         control={control}
//         render={({ field }) => (
//           <TourMap stops={field.value} onStopsChange={field.onChange} />
//         )}
//       />

//       <button type="submit">Create Tour</button>
//     </form>
//   );
// };