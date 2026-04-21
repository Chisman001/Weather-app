import { SearchLocationInput } from '@/components/location/search-location-input';
import { SavedLocationsList } from '@/components/location/saved-locations-list';
import { UseMyLocationButton } from '@/components/location/use-my-location-button';

export const metadata = {
  title: 'Location – Castfor',
};

export default function LocationPage() {
  return (
    <div className="py-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Location</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search and select your weather location.
        </p>
      </div>

      <UseMyLocationButton />
      <SearchLocationInput />

      <SavedLocationsList />
    </div>
  );
}
