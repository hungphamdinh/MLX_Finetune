// FormTotalScore.test.js
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import FormTotalScore from '../FormTotalScore'; // Adjust the import path as needed


describe('FormTotalScore Component', () => {
  const renderTotalScore = (totalScores) =>     render(<FormTotalScore totalScores={totalScores} />);

  test('renders nothing when totalScores is an empty array', () => {
    renderTotalScore([])
    const cardElement = screen.queryByTestId('card');
    expect(cardElement).toBeNull();
  });

  test('renders nothing when totalScore is zero', () => {
    const totalScores = [
      { section: 'Section 1', score: 0 },
      { section: 'Section 2', score: 0 },
    ];
    renderTotalScore(totalScores);
    const cardElement = screen.queryByTestId('card');
    expect(cardElement).toBeNull();
  });

  test('renders total score and each section score when totalScore is positive', () => {
    const totalScores = [
      { section: 'Section 1', score: 5 },
      { section: 'Section 2', score: 5 },
      { section: 'Section 3', score: 2 },
    ];
    renderTotalScore(totalScores);

    const cardElement = screen.getByTestId('card');
    expect(cardElement).toBeTruthy();
    
    expect(screen.getByText('FORM_TOTAL_SCORE: 12')).toBeTruthy();
    
    expect(screen.getByText('Section 1: 5 SCORE')).toBeTruthy();
    expect(screen.getByText('Section 2: 5 SCORE')).toBeTruthy();
    expect(screen.getByText('Section 3: 2 SCORE')).toBeTruthy();
  });

  test('only renders sections with score greater than zero', () => {
    const totalScores = [
      { section: 'Section 1', score: 5 },
      { section: 'Section 2', score: 0 },
      { section: 'Section 3', score: 2 },
    ];
    renderTotalScore(totalScores);
    
    expect(screen.getByText('FORM_TOTAL_SCORE: 7')).toBeTruthy();
    
    expect(screen.queryByText('Section 2: 0 SCORE')).toBeNull();
    
    expect(screen.getByText('Section 1: 5 SCORE')).toBeTruthy();
    expect(screen.getByText('Section 3: 2 SCORE')).toBeTruthy();
  });

  test('renders "Unnamed Section" when section name is missing', () => {
    const totalScores = [
      { section: 'Section 1', score: 3 },
      { section: '', score: 2 }, // Missing 'section'
    ];
    renderTotalScore(totalScores);
    
    expect(screen.getByText('FORM_TOTAL_SCORE: 5')).toBeTruthy();
    expect(screen.getByText(': 2 SCORE')).toBeTruthy();
    expect(screen.getByText('Section 1: 3 SCORE')).toBeTruthy();
  });

  test('does not render sections with score equal to zero', () => {
    const totalScores = [
      { section: 'Section 1', score: 0 },
      { section: 'Section 2', score: 0 },
      { section: 'Section 3', score: 5 },
    ];
    renderTotalScore(totalScores);
    
    expect(screen.getByText('FORM_TOTAL_SCORE: 5')).toBeTruthy();
    expect(screen.queryByText('Section 1: 0 SCORE')).not.toBeTruthy();
    expect(screen.queryByText('Section 2: 0 SCORE')).not.toBeTruthy();
    expect(screen.getByText('Section 3: 5 SCORE')).toBeTruthy();
  });
});
