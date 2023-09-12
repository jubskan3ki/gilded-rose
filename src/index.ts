enum ItemsName {
  AgedBrie = "Aged Brie",
  BackstagePasses = "Backstage passes to a TAFKAL80ETC concert",
  Sulfuras = "Sulfuras, Hand of Ragnaros",
  Conjured = "Conjured Mana Cake",
}

export class Item {
  name: ItemsName;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  private MAX_QUALITY = 50;
  private LEGENDARY_QUALITY = 80;
  private DEFAULT_QUALITY_UPDATE = 1;
  private MIN_SELLIN = 0;

  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality(): Array<Item> {
    this.items.forEach((item: Item) => {
      console.log(item.name, item.sellIn, item.quality);
      switch (item.name) {
        case ItemsName.AgedBrie:
          this.updateAgedBrie(item);
          break;
        case ItemsName.BackstagePasses:
          this.updateBackstagePasses(item);
          break;
        case ItemsName.Sulfuras:
          this.updateSulfuras(item);
          break;
        case ItemsName.Conjured:
          this.updateConjured(item);
          break;
        default:
          this.updateDefault(item);
          break;
      }
      this.updateSellIn(item);
    });
    return this.items;
  }

  private updateAgedBrie(item: Item): void {
    if (item.quality < this.MAX_QUALITY && item.sellIn > 0) {
      console.log(item.name, 'sell in', item.sellIn, 'quality=0');
      item.quality += this.DEFAULT_QUALITY_UPDATE;
    } else if (item.quality < this.MAX_QUALITY && item.sellIn <= 0) {
      console.log(item.name, 'sell in', item.sellIn, 'quality=0');
      item.quality += this.DEFAULT_QUALITY_UPDATE * 2;
    }
  }

  private updateBackstagePasses(item: Item): void {
    if (item.sellIn <= this.MIN_SELLIN) {
      console.log(item.name, 'sell in', item.sellIn, 'quality=0');
      item.quality = 0;
    } else {
      console.log(item.name, 'sell in', item.sellIn, 'quality++');
      item.quality += this.DEFAULT_QUALITY_UPDATE;
      if (item.sellIn <= 10) {
        console.log(item.name, 'sell in', item.sellIn, 'quality++');
        item.quality += this.DEFAULT_QUALITY_UPDATE;
      }
      if (item.sellIn <= 5) {
        console.log(item.name, 'sell in', item.sellIn, 'quality++');
        item.quality += this.DEFAULT_QUALITY_UPDATE;
      }
      item.quality > this.MAX_QUALITY ? item.quality = this.MAX_QUALITY : item.quality;
    }
  }

  private updateSulfuras(item: Item): void {
    console.log(item.name, 'sell in', item.sellIn, 'quality=80');
    item.quality = this.LEGENDARY_QUALITY;
  }

  private updateConjured(item: Item): void {
    if (item.sellIn > 0) {
      console.log(item.name, 'sell in', item.sellIn, 'quality-=2');
      item.quality -= this.DEFAULT_QUALITY_UPDATE * 2;
    } else {
      console.log(item.name, 'sell in', item.sellIn, 'quality-=4');
      item.quality -= this.DEFAULT_QUALITY_UPDATE * 4;
    }
  }

  private updateDefault(item: Item): void {
    if (item.quality > 0 && item.sellIn > 0) {
      console.log(item.name, 'sell in', item.sellIn, 'quality-=1');
      item.quality -= this.DEFAULT_QUALITY_UPDATE;
    } else if (item.quality > 0 && item.sellIn <= 0) {
      console.log(item.name, 'sell in', item.sellIn, 'quality-=2');
      item.quality -= this.DEFAULT_QUALITY_UPDATE * 2;
    }
  }

  private updateSellIn(item: Item): void {
    if (item.name !== ItemsName.Sulfuras) {
      console.log(item.name, 'update sell in');
      item.sellIn--;
    }
  }
}

