enum ItemsName {
    AgedBrie = "Aged Brie",
    BackstagePasses = "Backstage passes to a TAFKAL80ETC concert",
    Sulfuras = "Sulfuras, Hand of Ragnaros",
    Conjured = "Conjured Mana Cake",
}

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
    private MAX_QUALITY = 50;
    private DEFAULT_QUALITY_UPDATE = 1;
    private MIN_SELLIN = 0;

    items: Array<Item>;

    constructor(items: Array<Item> = []) {
        this.items = items;
    }

    updateQuality(): Array<Item> {
        console.log("Before update:");
        this.items.forEach(item => {
            console.log(`${item.name} - SellIn: ${item.sellIn}, Quality: ${item.quality}`);
            if (item.name !== ItemsName.Sulfuras) {
                this.adjustSellIn(item);
                this.adjustQuality(item);
            }
        });
        console.log("After update:");
        this.items.forEach(item => {
            console.log(`${item.name} - SellIn: ${item.sellIn}, Quality: ${item.quality}`);
        });
        return this.items;
    }

    private adjustSellIn(item: Item): void {
        item.sellIn -= 1;
    }

    private adjustQuality(item: Item): void {
        switch (item.name) {
            case ItemsName.AgedBrie:
                this.adjustAgedBrieQuality(item);
                break;
            case ItemsName.BackstagePasses:
                this.adjustBackstagePassQuality(item);
                break;
            default:
                this.adjustDefaultQuality(item);
                break;
        }
        this.ensureQualityBounds(item);
    }

    private adjustAgedBrieQuality(item: Item): void {
        console.log(`Aged Brie - Quality before: ${item.quality}`);
        item.quality += this.DEFAULT_QUALITY_UPDATE;
        if (item.sellIn < 0) item.quality += this.DEFAULT_QUALITY_UPDATE;
        console.log(`Aged Brie - Quality after: ${item.quality}`);
    }

    private adjustBackstagePassQuality(item: Item): void {
        console.log(`Backstage Pass - Quality before: ${item.quality}`);
        item.quality += item.sellIn < 6 ? 3 : item.sellIn < 11 ? 2 : 1;
        if (item.sellIn < 0) item.quality = this.MIN_SELLIN;
        console.log(`Backstage Pass - Quality after: ${item.quality}`);
    }

    private adjustDefaultQuality(item: Item): void {
        console.log(`Default item - Quality before: ${item.quality}`);
        item.quality -= item.sellIn < 0 ? 2 : 1;
        console.log(`Default item - Quality after: ${item.quality}`);
    }

    private ensureQualityBounds(item: Item): void {
        console.log(`Ensuring quality bounds for ${item.name}`);
        item.quality = Math.max(this.MIN_SELLIN, Math.min(item.quality, this.MAX_QUALITY));
        console.log(`${item.name} - Quality after ensuring bounds: ${item.quality}`);
    }
}