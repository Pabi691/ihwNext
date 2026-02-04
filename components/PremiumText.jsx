import { motion } from "framer-motion";

const PremiumText = () => {
  return (
    // <div className="flex items-center justify-center">
    //   <motion.h1
    //     className="text-sm font-bold text-white"
    //     initial={{ opacity: 0, scale: 0.8 }}
    //     animate={{ opacity: 1, scale: 1 }}
    //     transition={{ duration: 1 }}
    //   >
    //     <motion.span
    //       className="relative inline-block px-4 py-2"
    //       initial={{ textShadow: "0px 0px 10px rgba(255,215,0,0.8)" }}
    //       animate={{ textShadow: [
    //         "0px 0px 10px rgba(255,215,0,0.8)",
    //         "0px 0px 20px rgba(255,215,0,1)",
    //         "0px 0px 30px rgba(255,215,0,0.8)"
    //       ] }}
    //       transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    //     >
    //       PREMIUM
    //     </motion.span>
    //   </motion.h1>
    // </div>
    <div className="flex items-center justify-center">
      <motion.h1
        className="text-sm text-[#64ff00]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.span
          className="relative inline-block px-4 py-2"
          initial={{ textShadow: "0px 0px 10px rgba(255,255,255,0.8)" }}
          animate={{ textShadow: [
            "0px 0px 10px rgba(255,255,255,0.8)",
            "0px 0px 20px rgba(255,255,255,1)",
            "0px 0px 30px rgba(255,255,255,0.8)"
          ] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          Premium
        </motion.span>
      </motion.h1>
    </div>
  );
};

export default PremiumText;