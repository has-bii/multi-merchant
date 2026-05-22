CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"price" numeric NOT NULL,
	"merchantId" uuid NOT NULL,
	"productHetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_merchant_productHet_unique" UNIQUE("merchantId","productHetId")
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_merchantId_merchant_id_fk" FOREIGN KEY ("merchantId") REFERENCES "public"."merchant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_productHetId_productHets_id_fk" FOREIGN KEY ("productHetId") REFERENCES "public"."productHets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_merchantId_idx" ON "product" USING btree ("merchantId");--> statement-breakpoint
CREATE INDEX "product_productHetId_idx" ON "product" USING btree ("productHetId");