import {mock, instance} from 'ts-mockito';
import {QuoteItem} from './QuoteItem.entity';
import {Quote} from './Quote.entity';

describe('QuoteItem.entity', () => {
  it('testGetters', () => {
    const quote = mock(Quote);

    const quoteItem = new QuoteItem(
      'Développement mobile',
      1000,
      65000,
      instance(quote)
    );

    expect(quoteItem.getTitle()).toBe('Développement mobile');
    expect(quoteItem.getQuantity()).toBe(1000);
    expect(quoteItem.getDailyRate()).toBe(65000);
    expect(quoteItem.getAmountExcludingVat()).toBe(6500);
  });
});
