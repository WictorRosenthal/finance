ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "agreements" ADD COLUMN IF NOT EXISTS "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "user_id" uuid;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "payment_date" timestamp;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_accounts_user_id" ON "accounts" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agreements_user_id" ON "agreements" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_user_id" ON "transactions" ("user_id");
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk"
		FOREIGN KEY ("user_id") REFERENCES "users" ("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "agreements" ADD CONSTRAINT "agreements_user_id_users_id_fk"
		FOREIGN KEY ("user_id") REFERENCES "users" ("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk"
		FOREIGN KEY ("user_id") REFERENCES "users" ("id");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
