import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewNoteMutation } from './notesApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, text });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form onSubmit={onSaveNoteClicked} className='form'>
        <div className='form__title-row'>
          <h2>New Note</h2>
          <div className='form__action-buttons'>
            <button className='icon-button' title='Save' disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label htmlFor='title' className='form__label'>
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='text' className='form__label'>
          Description:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id='text'
          name='text'
          value={text}
          onChange={onTextChanged}
        />
        <label
          htmlFor='username'
          className='form__label form__checkbox-container'
        >
          ASSIGNED TO:
        </label>
        <select
          name='username'
          id='username'
          className='form__select'
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
};

export default NewNoteForm;
