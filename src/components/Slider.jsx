import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from './Spinner';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <div className='swiper-container'>
        <p className='exploreHeading'>Recommended</p>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          className='exploreSwiper'
          style={{ height: '32vh', cursor: 'pointer' }}
        >
          {listings.map(({ data, id }) => {
            return (
              <SwiperSlide
                key={id}
                onClick={() => navigate(`/category/${data.type}/${id}`)}
              >
                <div
                  style={{
                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='swiperSlideDiv'
                >
                  <p className='swiperSlideText'>{data.name}</p>
                  <p className='swiperSlidePrice'>
                    ${data.discountedPrice ?? data.regularPrice}{' '}
                    {data.type === 'rent' && '/ month'}
                  </p>
                  <p className='listingType swiperSlideType'>
                    {' '}
                    Available for {data.type}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    )
  );
}

export default Slider;
