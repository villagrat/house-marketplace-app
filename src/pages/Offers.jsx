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
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
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
          limit(5)
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

        // for pagination purposes
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('There was an error while fetching the listings...');
      }
    };
    fetchListings();
  }, []);

  // pagination - load more
  const onFetchMoreListings = async () => {
    try {
      // get reference to the collection
      const listingsRef = collection(db, 'listings');

      // create a query - Firebase 9 syntax
      // takes in [reference to collection, criteria for query]
      // need the useParams() hook to dynamically fetch params
      // params.categoryName === /category/:categoryName @ App.js
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(5)
      );

      // execute the query && get snapshot of documents
      const querySnap = await getDocs(q);

      // pagination
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      // loop thru, use doc methods to extract { id, data }
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // preserve previously stored listings @ state
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('There was an error while fetching the listings...');
    }
  };

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

          <br />
          <br />
          {lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load more
            </p>
          )}
        </>
      ) : (
        <p>There are currently no offers listed</p>
      )}
    </div>
  );
}

export default Offers;
