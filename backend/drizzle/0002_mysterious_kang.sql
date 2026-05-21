CREATE TABLE "merchant" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"name" text NOT NULL,
	"userId" uuid NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "merchant_name_unique" UNIQUE("name"),
	CONSTRAINT "merchant_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "merchant" ADD CONSTRAINT "merchant_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "merchant_userId_idx" ON "merchant" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "merchant_name_idx" ON "merchant" USING btree ("name");