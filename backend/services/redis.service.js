import Redis from "ioredis";
const redis=new Redis({
    host:"redis-10631.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port:10631,
    password:"l6DC40PHcnuUxNc5RYPTNv7i6dG0hqye"
});
redis.on('connect',()=>{
    console.log("Redis connected");
    
})
export default redis