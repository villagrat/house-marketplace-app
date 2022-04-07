import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference to the collection
        const listingsRef = collection(db, 'listings');

        // create a query - Firebase 9 syntax
        // takes in [reference to collection, criteria for query]
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // execute the query && get snapshot of documents
        const querySnap = await getDocs(q);

        // loop thru, use doc methods to extract { id, data }
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('There was an error while fetching the listings...');
      }
    };
    fetchListings();
  }, []);

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are currently no offers listed</p>
      )}
    </div>
  );
}

export default Offers;
