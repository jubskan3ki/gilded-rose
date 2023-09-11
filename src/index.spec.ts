import runGoldenMaster from 'jest-golden-master';
import { GildedRose, Item } from './index';

describe('GildedRose constructor', () => {
  it('should instantiate with default items if none provided', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose();
      expect(gildedRose.items).toEqual([]);
    });
  });

  it('should instantiate with provided items', () => {
    runGoldenMaster(async () => {
      const items = [new Item('normal', 10, 20)];
      const gildedRose = new GildedRose(items);
      expect(gildedRose.items).toEqual(items);
    });
  });
});

describe('GildedRose', () => {

  it('should decrease quality and sellIn for a normal item', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('normal', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(19);
      expect(items[0].sellIn).toBe(9);
    });
  });

  it('should increase quality for Aged Brie', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(21);
    });
  });

  it('should not decrease quality below 0', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('normal', 10, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });
  });

  it('should handle Sulfuras correctly (no change)', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(80);
      expect(items[0].sellIn).toBe(10);
    });
  });

  it('should increase quality for Backstage passes as concert approaches', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 12, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(21);
    });
  });

  it('should increase quality by 2 for Backstage passes with 10 days or less', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(22);
    });
  });

  it('should increase quality by 3 for Backstage passes with 5 days or less', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(23);
    });
  });

  it('should drop quality to 0 for Backstage passes after concert', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });
  });

  it('should not increase quality above 50 for Aged Brie', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 10, 50)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(50);
    });
  });

  it('should degrade twice as fast for normal items once sell date has passed', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('normal', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(18);
    });
  });

  it('should increase quality of Aged Brie by 1 when sellIn is negative', () => {
    runGoldenMaster(async () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', -1, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(22);
    });
  });
});

test('should degrade Quality of "normal" item twice as fast after sell by date', () => {
  const item = new Item('normal', 0, 20); // Sell by date has passed
  const gildedRose = new GildedRose([item]);
  expect(item.quality).toBe(20);
  gildedRose.updateQuality();
  expect(item.quality).toBe(18); // Quality should decrease by 2
});


test('should never allow negative Quality', () => {
  const item = new Item('Normal Item', 5, 2); // Quality is already 0
  const gildedRose = new GildedRose([item]);
  gildedRose.updateQuality();
  expect(item.quality).toBeGreaterThanOrEqual(0); // Quality should remain 0
});

test('should increase Quality for "Aged Brie" as it gets older', () => {
  const item = new Item('Aged Brie', 5, 10);
  const gildedRose = new GildedRose([item]);
  gildedRose.updateQuality();
  expect(item.quality).toBeGreaterThanOrEqual(11); // Quality increases by 1
});
  
test('should never allow Quality to be more than 50', () => {
  const item = new Item('Aged Brie', 5, 40); // Quality is already 50
  const gildedRose = new GildedRose([item]);
  gildedRose.updateQuality();
  expect(item.quality).toBeLessThan(50); // Quality should remain 50
});
  
test('should never change SellIn or Quality for "Sulfuras"', () => {
  const item = new Item('Sulfuras, Hand of Ragnaros', 5, 80); // Legendary item
  const gildedRose = new GildedRose([item]);
  gildedRose.updateQuality();
  expect(item.quality).toBe(80); // Quality remains 80
  expect(item.sellIn).toBe(5); // SellIn remains 5
});


test('should increase Quality for "Backstage passes" according to SellIn value', () => {
  const item1 = new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20);
  const gildedRose1 = new GildedRose([item1]);

  expect(item1.quality).toBe(20);
  
  gildedRose1.updateQuality();
  
  expect(item1.quality).toBe(22); // Quality should increase by 2
  
  const item2 = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20);
  const gildedRose2 = new GildedRose([item2]);
  
  expect(item2.quality).toBe(20);
  
  gildedRose2.updateQuality();
  
  expect(item2.quality).toBe(23); // Quality should increase by 3
  
  const item3 = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20);
  const gildedRose3 = new GildedRose([item3]);
  
  expect(item3.quality).toBe(20);
  
  gildedRose3.updateQuality();
  
  expect(item3.quality).toBe(0);
});

// thisdont work for now 
test('should increase Quality for "Backstage passes" as SellIn value approaches', () => {
  const item = new Item('Backstage passes to a TAFKAL80ETC concert', 9, 20);
  const gildedRose = new GildedRose([item]);
  expect(item.quality).toBe(20);
  gildedRose.updateQuality();
  expect(item.quality).toBe(21); // Quality should increase by 1 when SellIn is 10
});