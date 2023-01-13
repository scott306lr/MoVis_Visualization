# DVVA_Final-Project
[111 Fall] Data Visualization and Visual Analytics Final Project

### Group Member:

- 0716021 張家豪
- 0816137 王培碩
- 0816153 陳琮方



### How to start MoVis on your local machine

1. Clone the repository, go to the *movis* folder

   ```bash
   git clone https://github.com/andy89923/DVVA_Final-Project
   
   cd DVVA_Final-Project/movis
   ```

2. Set environment variables:

   ```bash
   cp .env.example .env
   #modify .env to connect to db afterwards if needed
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start development server:

   ```bash
   pnpm dev
   ```



### How to generate connection with the database:

Modify ${DATABASE_URL} inside *.env* :

```bash
DATABASE_URL='mysql://root@127.0.0.1:3309/movis-app'
```

Prisma reads schema and generate the correct data source client code (for code autocomplete):

```bash
pnpm prisma generate
```





Create connection with PlanetScale's database on localhost:3309 :  [Instructions for downloading pscale](https://github.com/planetscale/cli#installation) 

```bash
# Switch organization
pscale org switch <ORGANIZATION_NAME>  # pscale org switch movis

# Connect to database locally
pscale connect <DATABASE_NAME> main --port 3309 # pscale connect movis-app main --port 3309

# (Optional) Check database with CLI
pnpm prisma studio
```



