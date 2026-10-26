import { Fragment, useState } from 'react';

const ratingOptions = [
  { value: 5, title: 'perfect' },
  { value: 4, title: 'good' },
  { value: 3, title: 'not bad' },
  { value: 2, title: 'badly' },
  { value: 1, title: 'terribly' },
];

function CommentForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const isValid = rating > 0 && comment.trim().length >= 50;

  return (
    <form className='reviews__form form' onSubmit={(event) => event.preventDefault()}>
      <label className='reviews__label form__label' htmlFor='review'>Your review</label>
      <div className='reviews__rating-form form__rating'>
        {ratingOptions.map((option) => (
          <Fragment key={option.value}>
            <input
              className='form__rating-input visually-hidden'
              name='rating'
              value={option.value}
              id={`${option.value}-stars`}
              type='radio'
              checked={rating === option.value}
              onChange={() => setRating(option.value)}
              aria-label={option.title}
              required
            />
            <label htmlFor={`${option.value}-stars`} className='reviews__rating-label form__rating-label' title={option.title}>
              <svg className='form__star-image' width='37' height='33'><use xlinkHref='#icon-star' /></svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        className='reviews__textarea form__textarea'
        id='review'
        name='review'
        placeholder='Tell how was your stay, what you like and what can be improved'
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        minLength={50}
        required
      />
      <div className='reviews__button-wrapper'>
        <p className='reviews__help'>
          To submit review please make sure to set <span className='reviews__star'>rating</span> and describe your stay with at least <b className='reviews__text-amount'>50 characters</b>.
        </p>
        <button className='reviews__submit form__submit button' type='submit' disabled={!isValid}>Submit</button>
      </div>
    </form>
  );
}

export default CommentForm;
