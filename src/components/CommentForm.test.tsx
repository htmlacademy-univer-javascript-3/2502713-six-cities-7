import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from './CommentForm';

describe('Comment form', () => {
  afterEach(cleanup);

  it('requires a rating and at least 50 characters before submission', async () => {
    const user = userEvent.setup();
    render(<CommentForm />);
    const submit = screen.getByRole('button', { name: 'Submit' });
    const comment = screen.getByRole('textbox', { name: 'Your review' });

    expect(submit).toBeDisabled();
    await user.type(comment, 'a'.repeat(49));
    await user.click(screen.getByRole('radio', { name: 'perfect' }));
    expect(submit).toBeDisabled();

    await user.type(comment, 'a');
    expect(comment).toHaveValue('a'.repeat(50));
    expect(submit).toBeEnabled();

    await user.click(screen.getByRole('radio', { name: 'good' }));
    expect(screen.getByRole('radio', { name: 'good' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'perfect' })).not.toBeChecked();

    await user.clear(comment);
    expect(submit).toBeDisabled();
  });

  it('keeps the draft without reloading when the form is submitted', async () => {
    const user = userEvent.setup();
    render(<CommentForm />);
    const text = 'The apartment was comfortable and the location was excellent.';
    const comment = screen.getByRole('textbox', { name: 'Your review' });

    await user.type(comment, text);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'good' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(comment).toHaveValue(text);
    expect(screen.getByRole('radio', { name: 'good' })).toBeChecked();
  });
});
